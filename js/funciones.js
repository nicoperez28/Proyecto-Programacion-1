window.addEventListener("load", inicio);

let sistema = new Sistema();

function inicio() {
    ocultarDivs()
    get("btnCrearUsuario").addEventListener("click", crearUsuario);
    get("btnIngresar").addEventListener("click", login);
    get("btnAlquilar").addEventListener("click", alquiler);
    get("btnValidar").addEventListener("click", activarUsuario);
    get("btnBloquear").addEventListener("click", bloquearUsuario);
    get("btnDesbloquear").addEventListener("click", desbloquearUsuario);
    get("btnNumStock").addEventListener("click", cambiarStock);
    get("btnSalir").addEventListener("click", logout);
    get("btnSalirAdmin").addEventListener("click", logoutAdmin);
    get("listaDeInstancias").addEventListener("change", listadoDeInstancias);
}

function crearUsuario() {
    let nombre = get("nombre").value
    let apellido = get("apellido").value
    let nomUsuario = get("nomUsuario").value.toLowerCase();
    let pass = get("passRegistro").value
    let numTarjeta = get("tarjeta").value
    let codTarjeta = parseInt(get("cvc").value)
    if (nombre === "" || apellido === "" || nomUsuario === "" ||
        pass === "" || numTarjeta === "" || codTarjeta === "") {
        get("pRegistro").innerHTML = "Debe llenar todos los campos"
    } else if (!sonLetras(nombre) || !sonLetras(apellido)) {
        get("pRegistro").innerHTML = "El nombre y el apellido no debe conter numeros";
    } else if (sistema.existeUsuario(nomUsuario) !== null || sistema.existeAdmin(nomUsuario) !== null) {
        get("pRegistro").innerHTML = "Usuario ya ingresado, por favor, ingresar otro";
    } else if (!chequeoPass(pass)[0]) {
        get("pRegistro").innerHTML = chequeoPass(pass)[1];
    } else if (!chequeoTarjeta(numTarjeta)) {
        get("pRegistro").innerHTML = "Tarjeta mal ingresada Ej: xxxx-xxxx-xxxx-xxxx";
    } else {
        alert("Usuario creado con exito");
        sistema.agregarUsuario(nombre, apellido, nomUsuario, pass, numTarjeta, codTarjeta, "pendiente");
        get("formRegistro").reset();
        get("pRegistro").innerHTML = "";
    }
}

function login() {
    let usuario = get("usuario").value.toLowerCase()
    let pass = get("pass").value;
    if (usuario === "" || pass === "") {
        alert("Los campos no pueden ser vacios")
    } else if (sistema.realizarLoginAdmin(usuario, pass)) {
        ocultarDiv("divIngresar");
        mostrarDiv("divAdmin");
        get("pLogin").innerHTML = "";
        actualizarSeccionAdmin();
        if(sistema.obtenerUsuariosPendientes().length > 0){
            alert ("Tienes usuarios penndientes para activar");
        } 
    } else if (sistema.realizarLoginUsuario(usuario, pass)) {
        ocultarDiv("divIngresar");
        mostrarDiv("divUsuario");
        get("pLogin").innerHTML = "";
        actualizarSeccionUsuario()
    } else if (!sistema.realizarLoginAdmin(usuario, pass) || !sistema.realizarLoginUsuario(usuario, pass)) {
        get("pLogin").innerHTML = "Usuario y/o contraseña incorrectos";
    }
}

function alquiler() {
    let c7small = get("c7smallBoton").checked;
    let c7medium = get("c7mediumBoton").checked;
    let c7large = get("c7largeBoton").checked;
    let r7small = get("r7smallBoton").checked;
    let r7medium = get("r7mediumBoton").checked;
    let r7large = get("r7largeBoton").checked;
    let i7medium = get("i7mediumBoton").checked;
    let i7large = get("i7largeBoton").checked;
    let texto = "";
    let precio = "";
    if (c7small) {
        texto = "c7small"
        precio = 20
    } else if (c7medium) {
        texto = "c7medium"
        precio = 30
    } else if (c7large) {
        texto = "c7large"
        precio = 50
    } else if (r7small) {
        texto = "r7small"
        precio = 35
    } else if (r7medium) {
        texto = "r7medium"
        precio = 50
    } else if (r7large) {
        texto = "r7large"
        precio = 60
    } else if (i7medium) {
        texto = "i7medium"
        precio = 30
    } else if (i7large) {
        texto = "i7large"
        precio = 50
    }
    if (sistema.agregarAlquiler(texto)) {
        alert(`Alquilado correctamente la instancia ${texto} a ${precio} dolares`);
        actualizarSeccionUsuario();
        actualizarSeccionAdmin()
    } else {
        alert("No hay stock")
    }

}


function listadoDeInstancias() {
    let contadorDeEncendidos = 0;
    let selectFiltro = get("listaDeInstancias").value;
    let texto = "";
    let lista = sistema.obtenerMisAlquileres();
    if (selectFiltro === "TodasLasInstancias") {
        for (let i = 0; i < lista.length; i++) {
            let alquilerActual = lista[i];
            contadorDeEncendidos += alquilerActual.cantEncendidos
            texto += `
                <tr>
                    <td>${alquilerActual.instancia.nombre}</td>
                    <td>${alquilerActual.estado}</td>
                    <td>${alquilerActual.cantEncendidos}</td>`
            if (alquilerActual.estado === "encendido") {
                texto += `<td><input type="button" value="Apagar"  id="${alquilerActual.id}-Alquiler" class="apagarInstancia"></td></tr>`
            } else {
                texto += `<td><input type="button" value="Encender"  id="${alquilerActual.id}-Alquiler" class="encenderInstancia"></td></tr>`
            }
        }
    }
    if (selectFiltro === "encendido") {
        for (let i = 0; i < lista.length; i++) {
            let alquilerActual = lista[i];
            if (alquilerActual.estado === selectFiltro) {
                texto += `
                        <tr>
                            <td>${alquilerActual.instancia.nombre}</td>
                            <td>${alquilerActual.estado}</td>
                            <td>${alquilerActual.cantEncendidos}</td>`
                if (alquilerActual.estado === "encendido") {
                    texto += `<td><input type="button" value="Apagar"  id="${alquilerActual.id}-Alquiler" class="apagarInstancia"></td></tr>`
                } else {
                    texto += `<td><input type="button" value="Encender"  id="${alquilerActual.id}-Alquiler" class="encenderInstancia"></td></tr>`

                }
            }
        }
    }
    if (selectFiltro === "apagado") {
        for (let i = 0; i < lista.length; i++) {
            let alquilerActual = lista[i];
            if (alquilerActual.estado === selectFiltro) {
                texto += `
                    <tr>
                        <td>${alquilerActual.instancia.nombre}</td>
                        <td>${alquilerActual.estado}</td>
                        <td>${alquilerActual.cantEncendidos}</td>`
                if (alquilerActual.estado === "encendido") {
                    texto += `<td><input type="button" value="Apagar"  id="${alquilerActual.id}-Alquiler" class="apagarInstancia"></td></tr>`
                } else {
                    texto += `<td><input type="button" value="Encender"  id="${alquilerActual.id}-Alquiler" class="encenderInstancia"></td></tr>`

                }
            }

        }


    }
    get("tBodyTabla").innerHTML = texto;
    get("contadorEncendidos").innerHTML = "El total de enncendidos es: " + contadorDeEncendidos;

    let listaDeBotones = document.querySelectorAll(".apagarInstancia");
    for (let i = 0; i < listaDeBotones.length; i++) {
        let botonActual = listaDeBotones[i];
        botonActual.addEventListener("click", activarDinamico);
    }

    let listaDeBotonesDesactivar = document.querySelectorAll(".encenderInstancia");
    for (let i = 0; i < listaDeBotonesDesactivar.length; i++) {
        let botonActual = listaDeBotonesDesactivar[i];
        botonActual.addEventListener("click", desactivarDinamico);
    }
}

function activarDinamico() {
    let id = parseInt(this.id)
    sistema.apagarInstancia(id)
    actualizarSeccionUsuario()
    alert("Apagado")
}

function desactivarDinamico() {
    let id = parseInt(this.id)
    sistema.encenderInstancia(id)
    actualizarSeccionUsuario()
    alert("Encendido")
}

function activarUsuario() {
    let id = parseInt(get("selectParaValidar").value)
    if (isNaN(id)) {
        alert("No hay usuarios para activar");
    } else {
        alert("Usuario activado")
        sistema.activarUsuario(id);
        actualizarSeccionAdmin()
    }
}

function bloquearUsuario() {
    let id = parseInt(get("selectParaBloquear").value)
    if (isNaN(id)) {
        alert("No hay usuarios para bloquear");
    } else {
        alert("Usuario bloqueado")
        sistema.bloquearUsuario(id);
        actualizarSeccionAdmin()
    }
}

function desbloquearUsuario() {
    let id = parseInt(get("selectParaDesbloquear").value)
    if (isNaN(id)) {
        alert("No hay usuarios para desbloquear");
    } else {
        alert("Usuario desbloqueado")
        sistema.activarUsuario(id);
        actualizarSeccionAdmin()
    }
}

function cambiarStock() {
    let id = parseInt(get("selectStock").value)
    let num = parseInt(get("numStock").value)
    if (isNaN(num) || num < 0) {
        alert("No se modifico stock");
    } else {
        alert("Stock modificado con exito")
        sistema.modificarStock(id, num);
        cargarStockCombo();
        get("numStock").value = "";
    }
}

function logout() {
    ocultarDivs()
    mostrarDiv("divIngresar");
    sistema.realizarLogout();
}

function logoutAdmin() {
    ocultarDivs();
    mostrarDiv("divIngresar");
    sistema.realizarLogout();
}

function cargarStockCombo() {
    let cargar = ""
    for (let i = 0; i < sistema.listaDeInstancias.length; i++) {
        let instanciaActual = sistema.listaDeInstancias[i];
        cargar += `<option value="${instanciaActual.id}">${instanciaActual.nombre} - stock: ${instanciaActual.stock}</option>`;
    }
    get("selectStock").innerHTML = cargar;
}

function obtenerCostoPorInstancia() {
    let texto = "";
    for (let i = 0; i < sistema.listaDeInstancias.length; i++) {
        let instanciaActual = sistema.listaDeInstancias[i];
        let cantEncendido = 0;
        let costoTotal = 0;
        for (let j = 0; j < sistema.obtenerMisAlquileres().length; j++) {
            let alquilerActual = sistema.obtenerMisAlquileres()[j];
            if (alquilerActual.instancia.id === instanciaActual.id) {
                cantEncendido += alquilerActual.cantEncendidos;
                costoTotal += alquilerActual.obtenerCosto();
            }
        }
        if (costoTotal > 0) {
            texto += `
                        <tr>
                            <td>${instanciaActual.nombre}</td>
                            <td>${instanciaActual.precioEncendido}</td>
                            <td>${cantEncendido}</td>
                            <td>${costoTotal}</td>
                        </tr>`
        }

    }
    get("tBodyTablaCostos").innerHTML = texto;
}

function obtenerCostoTotalAdmin() {
    let texto = "";
    let costoTotaldeAlquileres = 0;
    for (let i = 0; i < sistema.listaDeInstancias.length; i++) {
        let instanciaActual = sistema.listaDeInstancias[i];
        let costoTotal = 0;
        let cant = 0;
        for (let j = 0; j < sistema.listaDeAlquiler.length; j++) {
            let alquilerActual = sistema.listaDeAlquiler[j];
            if (alquilerActual.instancia.id === instanciaActual.id) {
                costoTotal += alquilerActual.obtenerCosto();
                cant++;
            }
        }
        costoTotaldeAlquileres += costoTotal
        if (costoTotal > 0) {
            texto += `
                            <tr>
                                <td>${instanciaActual.nombre}</td>
                                <td>${cant}</td>
                                <td>${costoTotal}</td>
                            </tr>`
        }

    }
    get("tBodyTablaAdmin").innerHTML = texto;
    get("spanIngreso").innerHTML = costoTotaldeAlquileres;
}
