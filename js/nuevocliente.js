(function() {
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        formulario.addEventListener('submit', validarCliente);
        conectarDB();
    })


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
})();

