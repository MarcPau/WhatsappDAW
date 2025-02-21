export async function getApi(endpoint, datos = null) {

    try {

        //Creamos el link genérico
        let link = `http://127.0.0.1:8000/${endpoint}`;

        // Concatenamos el link y lo dejamos construïdo completamente
        if(datos) {
        datos.forEach(dato => {

            link += `/${dato}`;
            
       })
       };

        //Usamos el link para obtener la info que queremos
        let response = await fetch(link, {
            method: 'GET',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json'
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

export async function postApi(endpoint, datos) {
    try {
        // Creamos el link genérico
        let link = `http://127.0.0.1:8000/${endpoint}`;

        // Enviamos los datos al servidor
        let response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
           },
            body: JSON.stringify(datos),
            credentials : "include"
       });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
       }

        let data = await response.json();
        return data;
   } catch (error) {
        console.error('Error:', error);
        return "Fallo";
   }
}

export async function deleteApi(endpoint, datos) {
    try {
        // Creamos el link genérico
        let link = `http://127.0.0.1:8000/${endpoint}`;

        // Enviamos los datos al servidor
        let response = await fetch(link, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                
           },
            body: JSON.stringify(datos),
            credentials : 'include'
       });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
       }

        let data = await response.json();
        return data;
   } catch (error) {
        console.error('Error:', error);
        return "Fallo";
   }
}

export async function putApi(endpoint, datos) {
    try {
        // Creamos el link genérico
        let link = `http://127.0.0.1:8000/${endpoint}`;

        // Enviamos los datos al servidor
        let response = await fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                
           },
            body: JSON.stringify(datos),
            credentials: 'include'
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