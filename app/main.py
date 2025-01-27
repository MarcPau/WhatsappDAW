from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from collections import defaultdict
from datetime import date, datetime, timedelta
import database
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Optional

app = FastAPI()
db=database.whatsapp()
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

@app.post("/")
def login(usuario,password):
    

    return {"message": "Welcome to the home page!"}

#muestra lista amigos
@app.get("/llistaamics")
def read_amics():
    db.conecta()
    id_usuario= 3 #esto vendra por token
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
    id_admin= 4 #esto vendra por token
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
    result=db.enviarMensaje(datos.mensaje,id_emisor,datos.id_receptor)
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

