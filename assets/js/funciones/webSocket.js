import * as app from './app.js';
import {lista} from '../funciones/lista.js'
import  {wsClient} from '../main_js/mainChat.js'

export class WebSocketClient {
    constructor(userId, groups) {
        this.userId = userId;
        this.groups = groups;
        this.sockets = {};
        this.connect();
    }

    connect() {
        // Conectar WebSocket del usuario
        if (!this.sockets[this.userId]) {
            this.sockets[this.userId] = this.createWebSocket(this.userId);
        }

        // Conectar WebSockets para cada grupo (uniéndose si ya existe)
        this.groups.forEach(groupId => {
            if (!this.sockets[groupId]) {
                this.sockets[groupId] = this.createWebSocket(groupId);
            }
        });
    }

    disconnectWebSocket(clientId) {
        if (this.sockets[clientId]) {
            this.sockets[clientId].close();
            delete this.sockets[clientId]; // Eliminar referencia
            console.log(`WebSocket desconectado: ${clientId}`);
        } else {
            console.log(`No hay WebSocket activo para: ${clientId}`);
        }
    }

    connectWebSocket(clientId) {
        if (!this.sockets[clientId]) {
            this.sockets[clientId] = this.createWebSocket(clientId);
            console.log(`Nueva conexión WebSocket creada: ${clientId}`);
        } else {
            console.log(`WebSocket ya conectado: ${clientId}`);
        }
    }

    createWebSocket(clientId) {
        const socket = new WebSocket(`ws://localhost:8000/ws/${clientId}`);
            withCredentials: true;

        socket.onopen = () => {
            console.log(`Conectado a WebSocket: ${clientId}`);
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Mensaje recibido:", message);
            if (message.data.sender != this.userId) { // Evitar que el propio mensaje se procese en la UI
                this.handleMessage(message);
        
            }
        };

        socket.onclose = () => {
            console.log(`Desconectado de WebSocket: ${clientId}`);
        };

        return socket;
    }

    handleMessage( message) {
        setTimeout(async ()=>{
            switch (message.type) {
                case "mensaje":
                    await this.actualizarChat(message.data);
                    break;
                case "estado":
                    this.actualizarEstado(message.data);
                    break;
                case "estado_fuera":
                    this.actualizarEstadoFuera(message.data);
                    break;
                case "mensaje_grupo":
                    await this.actualizarChatGrupo(message.data);
                    break;
                case "nuevo_grupo":
                    await this.actualizarGrupoNuevo(message.data);
                    break;
                case "eliminar_grupo":
                    await this.actualizarGrupoEliminado(message.data);
                    break;
                case "cambiar_grupo":
                    await this.actualizarNombreGrupo(message.data);
                    break;
                case "admin_grupo":
                    this.actualizarAdminGrupo(message.data);
                    break;
                default:
                    console.log("Evento no reconocido:", message);
            }
        },200);
    }

    async actualizarChat(data) {
        let amigo = sessionStorage.getItem("id-amigo");
        if(amigo && amigo == data.sender){
            let li = document.querySelector(`li[id-amigo='${amigo}']`);
            li.dispatchEvent(new Event("click"));
        }else{
            await lista();
            await app.putApi("cambio-estado");
            let datos = {id_emisor:String(data.sender)};
            await app.postApi("rebote",datos);
        }
    }
    
    actualizarEstado(data) {
        let amigo = sessionStorage.getItem("id-amigo");
        if(amigo && amigo == data.sender){
            let mensajes = document.querySelectorAll("div > p:nth-of-type(2)");
            mensajes.forEach(mensaje => {
                mensaje.innerHTML = mensaje.innerHTML.replace(/(?<!✔)✔(?!✔)/g, "✔✔");
                mensaje.innerHTML = mensaje.innerHTML.replace("⏳", "✔✔");
            });
        }
    }

    actualizarEstadoFuera(data) {
        let amigo = sessionStorage.getItem("id-amigo");
        if(amigo && amigo == data.sender){
            let mensajes = document.querySelectorAll("div > p:nth-of-type(2)");
            mensajes.forEach(mensaje => {
                mensaje.innerHTML = mensaje.innerHTML.replaceAll("⏳", "✔");
            });
        }
    }

    async actualizarChatGrupo(data) {
        let grupo = sessionStorage.getItem("id-grupo");
        if(grupo && grupo == data.grupo){
            let li = document.querySelector(`li[id-grupo='${grupo}']`);
            li.dispatchEvent(new Event("click"));
        }else{
            await lista();
            await app.putApi("cambio-estado-grupo");
        }
    }

    async actualizarGrupoNuevo(data) {
        wsClient.connectWebSocket(data.grupo);
        await lista();
    }

    async actualizarGrupoEliminado(data) {
        let grupo = sessionStorage.getItem("id-grupo");
        let li = document.querySelector(`li[id-grupo='${grupo}']`).previousElementSibling;
        await lista();
        if(grupo && grupo == data.grupo){
            li.dispatchEvent(new Event("click"));
        }
        grupo = `grupo_${grupo}`;
        wsClient.disconnectWebSocket(grupo);
    }

    async actualizarNombreGrupo(data) {
        await lista();
        let grupo = sessionStorage.getItem("id-grupo");
        if(grupo && grupo == data.grupo){
            let li = document.querySelector(`li[id-grupo='${grupo}']`);
            li.dispatchEvent(new Event("click"));
        }
    }

    actualizarAdminGrupo(data) {
        let grupo = sessionStorage.getItem("id-grupo");
        if(grupo && grupo == data.grupo){
            let li = document.querySelector(`li[id-grupo='${grupo}']`);
            li.dispatchEvent(new Event("click"));
        }
    }

    logout() {
        Object.values(this.sockets).forEach(socket => {
            socket.close();
        });
        this.sockets = {};
        console.log("WebSockets cerrados en logout");
    }



}

