(function() {
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        formulario.addEventListener('submit', validarCliente);
        conectarDB();
    })

    function conectarDB() {
    setTimeout(()=>{
        console.log('conectando base de datos')
    },200);
    const abrirConexion = window.indexedDB.open('crm', 2);

    abrirConexion.onerror = function () {
        console.log('Hubo un error en la conexion a la BD');
    }

    //Si se creó bien
    abrirConexion.onsuccess = function() {
        DB = abrirConexion.result;
    }
    
};
    function validarCliente(e) { //Como es un submit va a tomar el evento (E);
        e.preventDefault();
        //Leer todos los inputs
        const nombre = document.querySelector("#nombre").value;
        const email = document.querySelector("#email").value;
        const telefono = document.querySelector("#telefono").value;
        const empresa = document.querySelector("#empresa").value;

        if(nombre === "" || email === "" || telefono === "" || empresa === ""){
            imprimirAlerta("Todos los campos son obligatorios", "error");
            return; //Para que no ejecute otras lineas de codigo
        } else{
        }
        //Crear un Objeto con la información
        const cliente = {
            nombre,
            email, 
            telefono, 
            empresa,
            
        }
        cliente.id = Date.now();
        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        // console.log(objectStore);
        objectStore.add(cliente);

        transaction.onerror = () => {
            console.log('Hubo un error!');
            imprimirAlerta('Hubo un Error', 'error');
            return;
        };
        transaction.oncomplete = () => {
            console.log('Cliente Agregado');
            // Mostrar mensaje de que todo esta bien...
            imprimirAlerta('Se agregó correctamente');

            setTimeout(() => {
                window.location.href = "index.html";    
            }, 3000);
            
            return;
        };
    }
    
    function imprimirAlerta(mensaje, tipo) {
        const alerta = document.querySelector(".alerta");
    if(!alerta){
        //Crear la alerta
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("px-4", "py-3", "rounded", "max-w-lg", "max-auto", "mt-6", "text-center", "border");
    
        if(tipo === "error"){
            divMensaje.classList.add("bg-red-100", "border-red-400", "text-red-700");
        } else {
            divMensaje.classList.add("bg-green-100", "border-green-400", "text-green-700");
        }
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    }
}
})();

