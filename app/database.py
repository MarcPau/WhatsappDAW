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

    def muestraAmigos(self,id_usuario):
        sql="SELECT id,username from usuarisclase WHERE id<>%s"
        self.cursor.execute(sql,id_usuario)
        ResQuery=self.cursor.fetchall()
        return ResQuery

    def muestraGrupos(self,id_usuario):
        sql="SELECT id,grupo from grupos INNER JOIN grupo_usuarios on id=id_grupo WHERE id_usuario=%s"
        self.cursor.execute(sql,id_usuario)
        ResQuery=self.cursor.fetchall()
        return ResQuery
    
    def muestraMensajesAmigo(self,id_emisor,id_receptor,offset_mensajes):
        sql="SELECT id_emisor,mensaje,estado,fecha_envio from mensajes where (id_emisor=%s and id_receptor=%s) or (id_emisor=%s and id_receptor=%s) order by id desc limit %s, 10"
        self.cursor.execute(sql,(id_emisor,id_receptor,id_receptor,id_emisor,offset_mensajes))
        ResQuery=self.cursor.fetchall()
        return ResQuery
    
    def muestraMensajesGrupo(self,id_grupo,offset_mensajes):
        sql="SELECT mensajes.id as id_mensaje,id_emisor,username,mensaje,fecha_envio from mensajes inner join usuarisclase on id_emisor=usuarisclase.id where id_grupo=%s order by mensajes.id desc limit %s, 10"
        self.cursor.execute(sql,(id_grupo,offset_mensajes))
        ResQuery=self.cursor.fetchall()
        return ResQuery
    
    def enviarMensaje(self,mensaje,id_emisor,id_receptor):
        sql="insert into mensajes(mensaje,id_emisor,id_receptor) values (%s,%s,%s) returning mensaje,estado,fecha_envio"
        self.cursor.execute(sql,(mensaje,id_emisor,id_receptor))
        ResQuery=self.cursor.fetchone()
        return ResQuery
    
    def cambiarEstado(self,id_receptor,id_emisor=None):
        if (id_emisor):
            sql="UPDATE mensajes SET estado ='leido' WHERE id_receptor=%s and id_emisor=%s and estado='entregado'"
            self.cursor.execute(sql,(id_receptor,id_emisor))
        else:
            sql="UPDATE mensajes SET estado ='entregado' WHERE id_receptor=%s and estado='enviado'"
            self.cursor.execute(sql,id_receptor)
        return "okay"
    
    def crearGrupo(self,id_admin,nombre_grupo,id_usuarios):
        sql="insert into grupos(grupo) values(%s) returning id"
        self.cursor.execute(sql,nombre_grupo)
        ResQuery=self.cursor.fetchone()
        sql="insert into grupo_usuarios values(%s,%s,TRUE)"
        self.cursor.execute(sql,(ResQuery["id"],id_admin))
        for usuario in id_usuarios:
            sql="insert into grupo_usuarios values(%s,%s,FALSE)"
            self.cursor.execute(sql,(ResQuery["id"],usuario))
        return "okay"
    
    def comprobarAdmin(self,id_admin,id_grupo):
        sql="select id_usuario from grupo_usuarios where id_grupo=%s and id_usuario=%s and admin=TRUE"
        self.cursor.execute(sql,(id_grupo,id_admin))
        return self.cursor.fetchone()

    def addUsuariosGrupo(self,id_admin,id_grupo,id_usuarios):
        ResQuery = self.comprobarAdmin(id_admin,id_grupo)
        if ResQuery:
            for usuario in id_usuarios:
                sql="insert into grupo_usuarios values(%s,%s,FALSE)"
                self.cursor.execute(sql,(id_grupo,usuario))
            return "okay"
        return "No tiene permiso de administrador"
    
    def deleteUsuariosGrupo(self,id_admin,id_grupo,id_usuarios):
        ResQuery = self.comprobarAdmin(id_admin,id_grupo)
        if ResQuery:
            for usuario in id_usuarios:
                sql="delete from grupo_usuarios where id_grupo=%s and id_usuario=%s"
                self.cursor.execute(sql,(id_grupo,usuario))
            return "okay"
        return "No tiene permiso de administrador"
    
    def cambiarNombreGrupo(self,id_admin,id_grupo,nombre_grupo):
        ResQuery = self.comprobarAdmin(id_admin,id_grupo)
        if ResQuery:
            sql="update grupos set grupo = %s where id = %s"
            self.cursor.execute(sql,(nombre_grupo,id_grupo))
            return "okay"
        return "No tiene permiso de administrador"
    
    def addAdminGrupo(self,id_admin,id_grupo,id_usuarios):
        ResQuery = self.comprobarAdmin(id_admin,id_grupo)
        if ResQuery:
            for usuario in id_usuarios:
                sql="update grupo_usuarios set admin=TRUE WHERE id_grupo=%s and id_usuario=%s"
                self.cursor.execute(sql,(id_grupo,usuario))
            return "okay"
        return "No tiene permiso de administrador"

    def deleteMyselfGrupo(self,id_usuario,id_grupo):
        sql="select id_usuario from grupo_usuarios where id_grupo=%s and id_usuario<>%s and admin=TRUE"
        self.cursor.execute(sql,(id_grupo,id_usuario))
        ResQuery = self.cursor.fetchone()
        if not ResQuery:
            sql="select id_usuario from grupo_usuarios where id_grupo=%s and id_usuario<>%s"
            self.cursor.execute(sql,(id_grupo,id_usuario))
            ResQuery = self.cursor.fetchone()
            if not ResQuery:
                print("estoy dentro")
                sql="delete from grupo_usuarios where id_grupo=%s"
                self.cursor.execute(sql,id_grupo)
                sql="delete from grupos where id=%s"
                self.cursor.execute(sql,id_grupo)
                return "grupo borrado"
            sql="update grupo_usuarios set admin=TRUE WHERE id_grupo=%s and id_usuario=(select id_usuario from grupo_usuarios where id_grupo=%s and id_usuario<>%s order by id_usuario limit 1)"
            self.cursor.execute(sql,(id_grupo,id_grupo,id_usuario))
        sql="delete from grupo_usuarios where id_grupo=%s and id_usuario=%s"
        self.cursor.execute(sql,(id_grupo,id_usuario))
        return "okay"