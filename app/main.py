from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from collections import defaultdict
from datetime import date, datetime, timedelta
import database
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
db=database.whatsapp()
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 99999

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite cualquier origen (cambiar en producción)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos: GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Permite todos los headers
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        # Decodifica el token JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        id_user: str = payload.get("id")
        if username is None or id_user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No se pudo validar las credenciales",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {"username": username, "id": id_user}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no válido",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/token", response_model=Token)
async def login(user: User):
    db.conecta()
    usuario = db.comprobarUsuari(user.username, user.password)
    db.desconecta()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nombre de usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )  
    # Genera el token de acceso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": usuario["username"],"id":usuario["id"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

#muestra lista amigos
@app.get("/llistaamics")
def read_amics(current_user: str = Depends(get_current_user)):
    db.conecta()
    id_usuario= current_user["id"] #esto vendra por token
    result=db.muestraAmigos(id_usuario)
    db.desconecta()
    return result

#muestra lista grupos
@app.get("/llistagrups")
def read_grups():
    db.conecta()
    id_usuario= 3 #esto vendra por token
    result=db.muestraGrupos(id_usuario)
    db.desconecta()
    return result

@app.post("/creargrup")
def write_grup(datos:Grupo):
    db.conecta()
    id_admin= 3 #esto vendra por token
    result=db.crearGrupo(id_admin,datos.nombre_grupo,datos.id_usuarios)
    db.desconecta()
    return result

@app.post("/addusuariosgrupo")
def add_usuario_grupo(datos:UsuariosGrupo):
    db.conecta()
    id_admin= 3 #esto vendra por token
    result=db.addUsuariosGrupo(id_admin,datos.id_grupo,datos.id_usuarios)
    db.desconecta()
    return result

@app.delete("/deleteusuariosgrupo")
def delete_usuario_grupo(datos:UsuariosGrupo):
    db.conecta()
    id_admin= 3 #esto vendra por token
    result=db.deleteUsuariosGrupo(id_admin,datos.id_grupo,datos.id_usuarios)
    db.desconecta()
    return result

@app.put("/cambiarnombregrupo")
def put_grupo(datos:NombreGrupoCambio):
    db.conecta()
    id_admin= 3 #esto vendra por token
    result=db.cambiarNombreGrupo(id_admin,datos.id_grupo,datos.nombre_grupo)
    db.desconecta()
    return result

@app.put("/addadmingrupo")
def add_admin_grupo(datos:UsuariosGrupo):
    db.conecta()
    id_admin= 3 #esto vendra por token
    result=db.addAdminGrupo(id_admin,datos.id_grupo,datos.id_usuarios)
    db.desconecta()
    return result

@app.delete("/deletemyselfgrupo")
def delete_yo_grupo(datos:UsuariosGrupo):
    db.conecta()
    id_usuario= 3 #esto vendra por token
    result=db.deleteMyselfGrupo(id_usuario,datos.id_grupo)
    db.desconecta()
    return result


#recibir mensajes amigo
@app.get("/missatgesamic/{id_receptor}/{offset_mensajes}")
def read_mensajes(id_receptor,offset_mensajes):
    db.conecta()
    id_emisor= 3 #esto vendra por token
    result=db.muestraMensajesAmigo(id_emisor,id_receptor,offset_mensajes)
    db.desconecta()
    return result

@app.get("/missatgesgrup/{id_grupo}/{offset_mensajes}")
def read_mensajes_grupo(id_grupo,offset_mensajes):
    db.conecta()
    result=db.muestraMensajesGrupo(id_grupo,offset_mensajes)
    db.desconecta()
    return result

#enviar mensaje a amigo
@app.post("/enviarmissatgeamic")
def write_mensaje(datos:EnvioMensaje):
    db.conecta()
    id_emisor= 3 #esto vendra por token
    result=db.enviarMensajeAmigo(datos.mensaje,id_emisor,datos.id_receptor)
    db.desconecta()
    return result

#cambiar estado mensaje
@app.put("/cambioestado")
def update_estado(datos:CambioEstado=None):
    db.conecta()
    id_receptor= 3 #esto vendra por token
    if (datos):
        result=db.cambiarEstado(id_receptor,datos.id_emisor)
    else:
        result=db.cambiarEstado(id_receptor)
    db.desconecta()
    return result

#cambiar estado mensaje grupo
@app.put("/cambioestadogrupo")
def update_estado_grupo(datos:CambioEstado=None):
    db.conecta()
    id_receptor= 3 #esto vendra por token
    if (datos):
        result=db.cambiarEstadoGrupo(id_receptor,datos.id_emisor)
    else:
        result=db.cambiarEstadoGrupo(id_receptor)
    db.desconecta()
    return result

#enviar mensaje a grupo
@app.post("/enviarmissatgegrup")
def write_mensaje_grupo(datos:EnvioMensaje):
    db.conecta()
    id_emisor= 3 #esto vendra por token
    result=db.enviarMensajeGrupo(datos.mensaje,id_emisor,datos.id_receptor)
    db.desconecta()
    return result

