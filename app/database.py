import pymysql.cursors
import sqlalchemy as db
import configparser
from werkzeug.security import check_password_hash

class whatsapp(object):
    def conecta(self):
        #Conexion a la BBDD del servidor mySQL
        self.db = pymysql.connect(host='localhost',
                                     user='root',
                                     password='marc2004',
                                     db='whatssap',
                                     charset='utf8mb4',
                                     autocommit=True,
                                     cursorclass=pymysql.cursors.DictCursor)
        self.cursor=self.db.cursor()

    def desconecta(self):
        self.db.close()

    def comprobar_usuario(self, username: str, password: str):
        self.conecta()
        sql="SELECT * from usuarisclase where username=%s"
        self.cursor.execute(sql,username)
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        if ResQuery and check_password_hash(ResQuery["password"],password):
            return {"id":ResQuery["id"],"username":ResQuery["username"]}
        return None

    def lista_amigos(self,id_usuario):
        self.conecta()
        sql="SELECT id,username from usuarisclase WHERE id<>%s"
        self.cursor.execute(sql,id_usuario)
        ResQuery=self.cursor.fetchall()
        self.desconecta()
        return ResQuery

    def lista_grupos(self,id_usuario):
        self.conecta()
        sql="SELECT id,grupo from grupos INNER JOIN grupo_usuarios on id=id_grupo WHERE id_usuario=%s"
        self.cursor.execute(sql,id_usuario)
        ResQuery=self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
    def mensajes_usuario(self,id_emisor,id_receptor,offset_mensajes):
        self.conecta()
        sql="SELECT id_emisor,mensaje,estado,fecha_envio from mensajes where (id_emisor=%s and id_receptor=%s) or (id_emisor=%s and id_receptor=%s) order by id desc limit %s, 10"
        self.cursor.execute(sql,(id_emisor,id_receptor,id_receptor,id_emisor,offset_mensajes))
        ResQuery=self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
    def mensajes_grupo(self,id_grupo,offset_mensajes):
        self.conecta()
        sql="SELECT mensajes.id as id_mensaje,id_emisor,username,mensaje,fecha_envio from mensajes inner join usuarisclase on id_emisor=usuarisclase.id where id_grupo=%s order by mensajes.id desc limit %s, 10"
        self.cursor.execute(sql,(id_grupo,offset_mensajes))
        ResQuery=self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
    def enviar_mensaje_usuario(self,mensaje,id_emisor,id_receptor):
        self.conecta()
        sql="insert into mensajes(mensaje,id_emisor,id_receptor) values (%s,%s,%s) returning mensaje,estado,fecha_envio"
        self.cursor.execute(sql,(mensaje,id_emisor,id_receptor))
        ResQuery=self.cursor.fetchone()
        self.desconecta()
        return ResQuery
    
    def enviar_mensaje_grupo(self,mensaje,id_emisor,id_grupo):
        self.conecta()
        sql="insert into mensajes(mensaje,id_emisor,id_grupo,estado) values (%s,%s,%s,NULL) returning id,mensaje,fecha_envio"
        self.cursor.execute(sql,(mensaje,id_emisor,id_grupo))
        mensaje=self.cursor.fetchone()
        sql="select id_usuario from grupo_usuarios where id_grupo=%s and id_usuario<>%s"
        self.cursor.execute(sql,(id_grupo,id_emisor))
        usuarios=self.cursor.fetchall()
        for usuario in usuarios:
            sql="insert into estado_mensajes_grupo(id_mensaje,id_usuario) values (%s,%s)"
            self.cursor.execute(sql,(mensaje["id"],usuario["id_usuario"]))
        self.desconecta()
        return mensaje
    
    def cambio_estado(self,id_receptor,id_emisor=None):
        self.conecta()
        if (id_emisor):
            sql="UPDATE mensajes SET estado ='leido' WHERE id_receptor=%s and id_emisor=%s and estado='entregado'"
            self.cursor.execute(sql,(id_receptor,id_emisor))
        else:
            sql="UPDATE mensajes SET estado ='entregado' WHERE id_receptor=%s and estado='enviado'"
            self.cursor.execute(sql,id_receptor)
        self.desconecta()
        return "okay"
    
    def cambio_estado_grupo(self,id_usuario,id_grupo=None):
        self.conecta()
        if (id_grupo):
            sql="UPDATE estado_mensajes_grupo as e inner join mensajes on id=id_mensaje SET e.estado ='leido' WHERE id_grupo=%s and id_usuario=%s and e.estado='entregado'"
            self.cursor.execute(sql,(id_grupo,id_usuario))
        else:
            sql="UPDATE estado_mensajes_grupo SET estado ='entregado' WHERE id_usuario=%s and estado='enviado'"
            self.cursor.execute(sql,id_usuario)
        self.desconecta()
        return "okay"
    
    def crear_grupo(self,id_admin,nombre_grupo,id_usuarios):
        self.conecta()
        sql="insert into grupos(grupo) values(%s) returning id"
        self.cursor.execute(sql,nombre_grupo)
        ResQuery=self.cursor.fetchone()
        sql="insert into grupo_usuarios values(%s,%s,TRUE)"
        self.cursor.execute(sql,(ResQuery["id"],id_admin))
        for usuario in id_usuarios:
            sql="insert into grupo_usuarios values(%s,%s,FALSE)"
            self.cursor.execute(sql,(ResQuery["id"],usuario))
        self.desconecta()
        return "okay"
    
    def comprobar_admin(self,id_admin,id_grupo):
        # IMPORTANTE - NO meter el conecta, porque esta funcion siempre se llama des de otra funcion
        sql="select id_usuario from grupo_usuarios where id_grupo=%s and id_usuario=%s and admin=TRUE"
        self.cursor.execute(sql,(id_grupo,id_admin))
        result = self.cursor.fetchone()
        return result

    def add_usuarios_grupo(self,id_admin,id_grupo,id_usuarios):
        self.conecta()
        ResQuery = self.comprobar_admin(id_admin,id_grupo)
        if ResQuery:
            for usuario in id_usuarios:
                sql="insert into grupo_usuarios values(%s,%s,FALSE)"
                self.cursor.execute(sql,(id_grupo,usuario))
            self.desconecta()
            return "okay"
        self.desconecta()
        return "No tiene permiso de administrador"
    
    def eliminar_usuarios_grupo(self,id_admin,id_grupo,id_usuarios):
        self.conecta()
        ResQuery = self.comprobar_admin(id_admin,id_grupo)
        if ResQuery:
            for usuario in id_usuarios:
                sql="delete from grupo_usuarios where id_grupo=%s and id_usuario=%s"
                self.cursor.execute(sql,(id_grupo,usuario))
            self.desconecta()
            return "okay"
        self.desconecta()
        return "No tiene permiso de administrador"
    
    def cambiar_nombre_grupo(self,id_admin,id_grupo,nombre_grupo):
        self.conecta()
        ResQuery = self.comprobar_admin(id_admin,id_grupo)
        if ResQuery:
            sql="update grupos set grupo = %s where id = %s"
            self.cursor.execute(sql,(nombre_grupo,id_grupo))
            self.desconecta()
            return "okay"
        self.desconecta()
        return "No tiene permiso de administrador"
    
    def add_admin_grupo(self,id_admin,id_grupo,id_usuarios):
        self.conecta()
        ResQuery = self.comprobar_admin(id_admin,id_grupo)
        if ResQuery:
            for usuario in id_usuarios:
                sql="update grupo_usuarios set admin=TRUE WHERE id_grupo=%s and id_usuario=%s"
                self.cursor.execute(sql,(id_grupo,usuario))
            self.desconecta()
            return "okay"
        self.desconecta()
        return "No tiene permiso de administrador"

    def eliminar_yo_grupo(self,id_usuario,id_grupo):
        self.conecta()
        sql="select id_usuario from grupo_usuarios where id_grupo=%s and id_usuario<>%s and admin=TRUE"
        self.cursor.execute(sql,(id_grupo,id_usuario))
        ResQuery = self.cursor.fetchone()
        if not ResQuery:
            sql="select id_usuario from grupo_usuarios where id_grupo=%s and id_usuario<>%s"
            self.cursor.execute(sql,(id_grupo,id_usuario))
            ResQuery = self.cursor.fetchone()
            if not ResQuery:
                sql="delete from grupo_usuarios where id_grupo=%s"
                self.cursor.execute(sql,id_grupo)
                sql="delete from grupos where id=%s"
                self.cursor.execute(sql,id_grupo)
                return "grupo borrado"
            sql="update grupo_usuarios set admin=TRUE WHERE id_grupo=%s and id_usuario=(select id_usuario from grupo_usuarios where id_grupo=%s and id_usuario<>%s order by id_usuario limit 1)"
            self.cursor.execute(sql,(id_grupo,id_grupo,id_usuario))
        sql="delete from grupo_usuarios where id_grupo=%s and id_usuario=%s"
        self.cursor.execute(sql,(id_grupo,id_usuario))
        self.desconecta()
        return "okay"
    
    def usuarios_grupo(self,id_admin,id_grupo,esMiembro):
        self.conecta()
        if esMiembro:
            sql="SELECT id,username FROM usuarisclase WHERE id<>%s and id IN (SELECT id_usuario FROM grupo_usuarios where id_grupo=%s)"
        else:
            sql="SELECT id,username FROM usuarisclase WHERE id<>%s and id NOT IN (SELECT id_usuario FROM grupo_usuarios where id_grupo=%s)"
        self.cursor.execute(sql,(id_admin,id_grupo))
        ResQuery = self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
    def admins_grupo(self,id_grupo):
        self.conecta()
        sql="select username,id_usuario from grupo_usuarios inner join usuarisclase on id_usuario=id where id_grupo=%s and admin=FALSE"
        self.cursor.execute(sql,(id_grupo))
        ResQuery = self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
    def estado_mensaje_grupo(self,id_mensaje):
        self.conecta()
        sql="select username,estado from estado_mensajes_grupo inner join usuarisclase on id=id_usuario where id_mensaje= %s"
        self.cursor.execute(sql,(id_mensaje))
        ResQuery = self.cursor.fetchall()
        self.desconecta()
        return ResQuery
    
