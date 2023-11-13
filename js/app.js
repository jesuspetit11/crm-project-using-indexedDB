(function() { //Las variables que pongamos en este archivo se mantendrán en forma local 

    let DB;

    document.addEventListener("DOMContentLoaded", ()=>{
        crearDB(); //Apenas se carguen todos los elementos del DOM se crea la BD

        if(window.indexedDB.open("crm", 1.0)){
            obtenerClientes();
        }
        
        listadoClientes.addEventListener("click", eliminarRegistro);
    }); 

    function eliminarRegistro(e) {
        if(e.target.classList.contains("eliminar")){
            const idEliminar = Number(e.target.dataset.cliente);

            const confirmar = confirm("Deseas eliminar?")

            if(confirmar){
                const transaction = DB.transaction(["crm"],"readwrite");
                const objectStore = transaction.objectStore("crm");
                objectStore.delete(idEliminar);

                transaction.oncomplete = function() {
                    console.log("Eliminado")
                    e.targe.parentElement.parentElement.remove();
                }
                transaction.onerror = function() {
                    console.log("Hubo un error")
                }
            }
        }
    }


    function crearDB() {

        //Creamos la BD
        const crearDB = window.indexedDB.open("crm", 1.0);

        //Si hubo un error
        crearDB.onerror = () =>{
            console.log("Hubo un error");
        }

        //Si se creó bien
        crearDB.onsuccess = () =>{
            console.log("BD creada con éxito");
            DB = crearDB.result; //Si se crea correctamente se asigna a esta variable
        }

        crearDB.onupgradeneeded = (e) =>{ //Cuando se crea nuestra BD se crean las columnas
            const db = e.target.result;

            const objectStore = db.createObjectStore("crm", {keyPath: "id", autoIncrement: true});

            //Definir las columnas
            objectStore.createIndex("nombre", "nombre", {unique: false});
            objectStore.createIndex("email", "email", {unique: true});
            objectStore.createIndex("telefono", "telefono", {unique: false});
            objectStore.createIndex("empresa", "empresa", {unique: false});
            objectStore.createIndex("id", "id", {unique: true});

            console.log("Se crearon las filas");
        }
    }

    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open("crm", 1.0);
        abrirConexion.onerror = function() {
            console.log("Hubo une error");
        }
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;

            const objectStore = DB.transaction("crm").objectStore("crm");

            objectStore.openCursor().onsuccess = function(e){ //Para mostrar los registos de la BD
                const cursor = e.target.result;
                if(cursor){
                    const { nombre, empresa, email, telefono, id } = cursor.value;
                    const listadoClientes = document.querySelector("#listado-clientes");
                    listadoClientes.innerHTML += ` 
                    <tr>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                        <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                        <p class="text-gray-700">${telefono}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                        <p class="text-gray-600">${empresa}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                        <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                        <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                    </td>
                </tr>
                `;
                    cursor.continue;
                }else{
                    console.log("No hay...")
                }
            }
        }
    }
})();