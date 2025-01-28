import * as App from 'app.js';

function crearGrupo(nombreGrupo, idUsuarios) { 

    let datos = {

        nombre_grupo: nombreGrupo,
        id_usuarios: idUsuarios

    };

    let resultado = App.post('creargrup', datos);
    return resultado;

}