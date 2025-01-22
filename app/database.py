import pymysql.cursors
import sqlalchemy as db
import configparser

class whatsapp(object):
    def conecta(self):
        #Conexion a la BBDD del servidor mySQL
        self.db = pymysql.connect(host='localhost',
                                     user='root',
                                     password='calamurta',
                                     db='whatsapp',
                                     charset='utf8mb4',
                                     autocommit=True,
                                     cursorclass=pymysql.cursors.DictCursor)
        self.cursor=self.db.cursor()

    def desconecta(self):
        self.db.close()

    def muestraAmigos(self):
        sql="SELECT id,username from usuarisclase"
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchall()
        return ResQuery
    
    def muestraMensajesAmigo(self,id_emisor,id_receptor):
        sql="SELECT mensaje,estado,fecha_envio from mensajes where id_emisor=%s and id_receptor=%s"
        self.cursor.execute(sql,(id_emisor,id_receptor))
        ResQuery=self.cursor.fetchall()
        return ResQuery
    
    def enviarMensaje(self,mensaje,id_emisor,id_receptor):
        sql="insert into mensajes(mensaje,id_emisor,id_receptor) values (%s,%s,%s) returning mensaje,estado,fecha_envio"
        self.cursor.execute(sql,(mensaje,id_emisor,id_receptor))
        ResQuery=self.cursor.fetchone()
        return ResQuery