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

@app.post("/")
def login(usuario,password):
    

    return {"message": "Welcome to the home page!"}

#muestra lista amigos
@app.get("/llistaamics")
def read_amics():
    db.conecta()
    result=db.muestraAmigos()
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