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

@app.post("/")
def login(usuario,password):
    

    return {"message": "Welcome to the home page!"}

@app.get("/llistaamics")
def read_amics():
    db.conecta()
    result=db.muestraAmigos()
    db.desconecta()
    return result

@app.get("/missatgesamic/{id_receptor}")
def read_mensajes(id_receptor):
    db.conecta()
    id_emisor= 3
    result=db.muestraMensajesAmigo(id_emisor,id_receptor)
    db.desconecta()
    return result

@app.post("/enviarmissatgeamic")
def write_mensaje( datos:EnvioMensaje):
    db.conecta()
    id_emisor= 3
    result=db.enviarMensaje(datos.mensaje,id_emisor,datos.id_receptor)
    db.desconecta()
    return result


