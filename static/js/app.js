async function getApi(endpoint, datos = null) {

    try {

        //Creamos el link genérico
        let link = `https://127.0.0.1:8000/${endpoint}`;

        // Concatenamos el link y lo dejamos construïdo completamente
        if(datos) {
        datos.forEach(dato => {

            link += `/${dato}`;
            
        })
        };

        //Usamos el link para obtener la info que queremos
        let response = await fetch(link, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer tu-token-si-es-necesario'
            }
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }

}

async function postApi(endpoint, datos) {
    try {
        // Creamos el link genérico
        let link = `https://127.0.0.1:8000/${endpoint}`;

        // Enviamos los datos al servidor
        let response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer tu-token-si-es-necesario'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteApi(endpoint, datos = null) {

    try {
        // Construir la URL
        let link = `https://127.0.0.1:8000/${endpoint}`;

        // Concatenar datos si no es null
        if (datos) {
            datos.forEach(dato => {
                link += `/${dato}`;
            });
        }

        // Realizar la solicitud DELETE
        let response = await fetch(link, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer tu-token-si-es-necesario'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }

}

async function putApi(endpoint, datos) {
    try {
        // Creamos el link genérico
        let link = `https://127.0.0.1:8000/${endpoint}`;

        // Enviamos los datos al servidor
        let response = await fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer tu-token-si-es-necesario'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}