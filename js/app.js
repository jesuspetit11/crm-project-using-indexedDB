(function() { //Las variables que pongamos en este archivo se mantendrán en forma local 

    let DB;

    document.addEventListener("DOMContentLoaded", ()=>{
        crearDB(); //Apenas se carguen todos los elementos del DOM se crea la BD
    }); 
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
})();