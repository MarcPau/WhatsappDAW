import json
from fastapi import FastAPI, Depends, HTTPException, status, Response, Request,WebSocket,WebSocketDisconnect
from pydantic import BaseModel
from collections import defaultdict
from datetime import date, datetime, timedelta
from database import whatsapp
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Optional, Dict,List
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
db=whatsapp()
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 99999
flag = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Diccionario para almacenar las conexiones activas
active_connections: Dict[str, List[WebSocket]] = {}



class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str
    password: str

class EnvioMensaje(BaseModel):
    mensaje : str
    id_receptor: str

class CambioEstado(BaseModel):
    id_emisor: str

class Grupo(BaseModel):
    nombre_grupo: str
    id_usuarios: list

class UsuariosGrupo(BaseModel):
    id_grupo: str
    id_usuarios: list

class NombreGrupoCambio(BaseModel):
    id_grupo: str
    nombre_grupo: str

# Función para crear un token JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
    
# Dependencia para proteger los endpoints
async def get_current_user(request: Request):
    token = request.cookies.get("jwt")  # Obtener token desde la cookie

    if not token:
        raise HTTPException(status_code=401, detail="No autorizado")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"username": payload["sub"], "id": payload["id"]}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")



# Enviar notificaciones en tiempo real
async def broadcast_event(event_type: str, client_id: str, data: dict):
    message = json.dumps({"type": event_type, "data": data})
    if client_id in active_connections:
        for connection in active_connections[client_id]:
            await connection.send_text(message)
        


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):

    
    await websocket.accept()
    
    if client_id not in active_connections:
        active_connections[client_id] = []
    active_connections[client_id].append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            # Aquí puedes procesar los datos entrantes si es necesario
            print(f"Mensaje recibido de {client_id}: {data}")
    except WebSocketDisconnect:
        active_connections[client_id].remove(websocket)
        if not active_connections[client_id]:
            del active_connections[client_id]
        print(f"{client_id} desconectado")

@app.post("/token")
def login(user: User, response: Response):
    
    usuario = db.comprobar_usuario(user.username, user.password)
    
    
    if not usuario:
        raise HTTPException(status_code=401, detail="Nombre de usuario o contraseña incorrectos")
    
    # Generar el token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": usuario["username"], "id": usuario["id"]}, expires_delta=access_token_expires)

    # Guardar el token en una cookie HTTP-Only
    response.set_cookie(
        key="jwt",
        value=access_token,
        httponly=True,    # Evita acceso desde JavaScript (protege contra XSS)
        secure=False,     # En producción, poner True para solo HTTPS
        samesite="Lax",   # Evita envío en requests de otros sitios
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60  # Tiempo de vida de la cookie
    )

    return {"message": "Login exitoso", "id": usuario["id"]}

@app.post("/rebote")
async def rebote(usuario: CambioEstado,current_user: str = Depends(get_current_user)):
    user_id = current_user["id"]
    await broadcast_event("estado_fuera",usuario.id_emisor,{"sender": user_id, "message": "ok"})
    return

@app.post("/logout")
def logout(response: Response, current_user: str = Depends(get_current_user)):
    user_id = current_user["id"]
    if user_id in active_connections:
        del active_connections[user_id]
    response.delete_cookie("jwt")
    return "Sesión cerrada"

#muestra lista amigos
@app.get("/lista")
def lista(current_user: str = Depends(get_current_user)):
    
    id_usuario= current_user["id"] #esto vendra por token
    result= db.lista(id_usuario)
    return result

@app.get("/lista-amigos")
def lista_amigos(current_user: str = Depends(get_current_user)):
    
    id_usuario= current_user["id"] #esto vendra por token
    result=db.lista_amigos(id_usuario)
    return result

@app.post("/crear-grupo")
async def crear_grupo(datos:Grupo,current_user: str = Depends(get_current_user)):
    
    id_admin= current_user["id"] #esto vendra por token
    result=db.crear_grupo(id_admin,datos.nombre_grupo,datos.id_usuarios)
    for usuario in datos.id_usuarios:
        await broadcast_event("nuevo_grupo",usuario,{"sender": id_admin, "message": "ok","grupo":f"grupo_{result["id"]}"})
    return result

@app.post("/add-usuarios-grupo")
async def add_usuarios_grupo(datos:UsuariosGrupo,current_user: str = Depends(get_current_user)):
    
    id_admin= current_user["id"] #esto vendra por token
    result=db.add_usuarios_grupo(id_admin,datos.id_grupo,datos.id_usuarios)
    for usuario in datos.id_usuarios:
        await broadcast_event("nuevo_grupo",usuario,{"sender": id_admin, "message": "ok","grupo":f"grupo_{datos.id_grupo}"})
    return result

@app.delete("/eliminar-usuarios-grupo")
async def eliminar_usuarios_grupo(datos:UsuariosGrupo , current_user: str = Depends(get_current_user)):
    
    id_admin= current_user["id"] #esto vendra por token
    result=db.eliminar_usuarios_grupo(id_admin,datos.id_grupo,datos.id_usuarios)
    for usuario in datos.id_usuarios:
        await broadcast_event("eliminar_grupo",usuario,{"sender": id_admin, "message": "ok","grupo":datos.id_grupo})
    return result

@app.put("/cambiar-nombre-grupo")
async def cambiar_nombre_grupo(datos:NombreGrupoCambio , current_user: str = Depends(get_current_user)):
    
    id_admin= current_user["id"]
    result=db.cambiar_nombre_grupo(id_admin,datos.id_grupo,datos.nombre_grupo)
    await broadcast_event("cambiar_grupo",f"grupo_{datos.id_grupo}",{"sender": id_admin, "message": "ok","grupo":datos.id_grupo})
    return result

@app.put("/add-admin-grupo")
async def add_admin_grupo(datos:UsuariosGrupo, current_user: str = Depends(get_current_user)):
    
    id_admin= current_user["id"] #esto vendra por token
    result=db.add_admin_grupo(id_admin,datos.id_grupo,datos.id_usuarios)
    for usuario in datos.id_usuarios:
        await broadcast_event("admin_grupo",usuario,{"sender": id_admin, "message": "ok","grupo":datos.id_grupo})
    return result

@app.delete("/eliminar-yo-grupo" )
async def eliminar_yo_grupo(datos:UsuariosGrupo , current_user: str = Depends(get_current_user)):
    
    id_usuario= current_user["id"] #esto vendra por token
    result=db.eliminar_yo_grupo(id_usuario,datos.id_grupo)
    if type(result) is dict:
        await broadcast_event("admin_grupo",str(result["id_usuario"]),{"sender": id_usuario, "message": "ok","grupo":datos.id_grupo})
    return result

#recibir mensajes usuario
@app.get("/mensajes-usuario/{id_receptor}/{offset_mensajes}")
async def mensajes_usuario(id_receptor,offset_mensajes ,current_user: str = Depends(get_current_user)):
    
    id_emisor= current_user["id"] #esto vendra por token
    result=db.mensajes_usuario(id_emisor,id_receptor,int(offset_mensajes))
    await broadcast_event("estado",id_receptor,{"sender": id_emisor, "message": "ok"})
    return result

@app.get("/mensajes-grupo/{id_grupo}/{offset_mensajes}")
def mensajes_grupo(id_grupo,offset_mensajes,current_user: str = Depends(get_current_user)):
    id_propia= current_user["id"] #esto vendra por token
    result=db.mensajes_grupo(id_grupo,id_propia,int(offset_mensajes))
    return result

#enviar mensaje a usuario
@app.post("/enviar-mensaje-usuario")
async def enviar_mensaje_usuario(datos:EnvioMensaje , current_user: str = Depends(get_current_user)):
    
    id_emisor= current_user["id"]
    result=db.enviar_mensaje_usuario(datos.mensaje,id_emisor,datos.id_receptor)
    await broadcast_event("mensaje",datos.id_receptor,{"sender": id_emisor, "message": "ok"})
    return result

#cambiar estado mensaje
@app.put("/cambio-estado")
def cambio_estado(datos:CambioEstado=None, current_user: str = Depends(get_current_user)):
    
    id_receptor= current_user["id"]
    if (datos):
        result=db.cambio_estado(id_receptor,datos.id_emisor)
    else:
        result=db.cambio_estado(id_receptor)
        
    
    return result

#cambiar estado mensaje grupo
@app.put("/cambio-estado-grupo")
def cambio_estado_grupo(datos:CambioEstado=None, current_user: str = Depends(get_current_user)):
    
    id_receptor= current_user["id"]
    if (datos):
        result=db.cambio_estado_grupo(id_receptor,datos.id_emisor)
    else:
        result=db.cambio_estado_grupo(id_receptor)
    
    return result

#enviar mensaje a grupo
@app.post("/enviar-mensaje-grupo")
async def enviar_mensaje_grupo(datos:EnvioMensaje, current_user: str = Depends(get_current_user)):
    
    id_emisor= current_user["id"]
    result=db.enviar_mensaje_grupo(datos.mensaje,id_emisor,datos.id_receptor)
    await broadcast_event("mensaje_grupo",f"grupo_{datos.id_receptor}",{"sender": id_emisor, "message": "ok","grupo":datos.id_receptor})
    return result

#devuelve los miembros que forman parte o no de un grupo
@app.get("/usuarios-grupo/{id_grupo}/{esMiembro}") # esMiembro es un booleano que determina si quiero saber los que son miembros del grupo (True) o los que no forman parte (False)
def usuarios_grupo(id_grupo,esMiembro : str, usuario: str = Depends(get_current_user)):
    
    esMiembro = esMiembro.lower() == "true"
    id_admin= usuario["id"]#esto vendra por token
    result=db.usuarios_grupo(id_admin,id_grupo,esMiembro)
    return result


@app.get("/admins-grupo/{id_grupo}") # Muestra las personas que NO son admins de un grupo
def admins_grupo(id_grupo):
    result=db.admins_grupo(id_grupo)
    return result

@app.get("/es-admin/{id_grupo}")
def es_admin(id_grupo, usuario: str = Depends(get_current_user)):
     id_admin= usuario["id"]#esto vendra por token
     db.conecta()
     result=db.comprobar_admin(id_admin,id_grupo)
     db.desconecta()
     return result

@app.get("/estado-mensaje-grupo/{id_mensaje}")
def estado_mensaje_grupo(id_mensaje):
    result=db.estado_mensaje_grupo(id_mensaje)
    return result