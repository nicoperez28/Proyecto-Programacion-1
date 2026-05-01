class Sistema {
    constructor() {
        this.listaDeUsuarios = [
            new Usuario("nicolas", "perez", "nico20", "Aaaa1", "4970100000000055", "111", "bloqueado"),
            new Usuario("guillermo", "vieira", "guille01", "Bbbb1", "4970100000000113", "222", "activo"),
            new Usuario("lucas", "rodriguez", "Luca007", "Cccc1", "4970100000000014", "333", "pendiente"),
            new Usuario("martina", "rodriguez", "Martu10", "Dddd1", "4970100000000063", "444", "bloqueado"),
            new Usuario("victoria", "riveron", "vicky04", "Eeee1", "4970100000000071", "555", "activo")
        ];
        this.listaDeAdmin = [
            new Administrador("nico28", "Aaaa1"),
            new Administrador("guille", "Bbbb1"),
            new Administrador("cami07", "Cccc1"),
            new Administrador("Juan89", "Dddd1"),
            new Administrador("Ailen18", "Eeee1")
        ];
        this.listaDeInstancias = [
            new Instancia("c7small", 20, 2.5, 10),
            new Instancia("c7medium", 30, 3.50, 10),
            new Instancia("c7large", 50, 6.00, 10),
            new Instancia("r7small", 35, 4.00, 10),
            new Instancia("r7medium", 50, 6.50, 10),
            new Instancia("r7large", 60, 7.00, 10),
            new Instancia("i7medium", 30, 3.50, 10),
            new Instancia("i7large", 50, 6.50, 10)
        ];
        this.listaDeAlquiler = [
            new Alquiler(this.listaDeUsuarios[1], this.listaDeInstancias[1], "encendido", 5),
            new Alquiler(this.listaDeUsuarios[1], this.listaDeInstancias[7], "apagado", 3),
            new Alquiler(this.listaDeUsuarios[4], this.listaDeInstancias[5], "encendido", 10),
            new Alquiler(this.listaDeUsuarios[1], this.listaDeInstancias[4], "apagado", 7),
            new Alquiler(this.listaDeUsuarios[4], this.listaDeInstancias[2], "encendido", 14),
            new Alquiler(this.listaDeUsuarios[4], this.listaDeInstancias[3], "encendido", 3),
            new Alquiler(this.listaDeUsuarios[1], this.listaDeInstancias[5], "apagado", 8),
            new Alquiler(this.listaDeUsuarios[4], this.listaDeInstancias[7], "encendido", 2),
            new Alquiler(this.listaDeUsuarios[4], this.listaDeInstancias[4], "encendido", 5),
            new Alquiler(this.listaDeUsuarios[1], this.listaDeInstancias[6], "apagado", 1)
        ];
        this.usuarioLogeado = null
    }

    obtenerUsuariosPendientes(){
        let listaPendietes = [];
        for (let i = 0; i < this.listaDeUsuarios.length; i++) {
            let usuarioActual = this.listaDeUsuarios[i];
            if(usuarioActual.estado === "pendiente"){
                listaPendietes.push(usuarioActual);
            }
        }
        return listaPendietes
    }

    obtenerUsuarios() {
        return this.listaDeUsuarios;
    }

    obtenerAdmin() {
        return this.listaDeAdmin;
    }

    obtenerInstancias() {
        return this.listaDeInstancias;
    }

    agregarUsuario(nombre, apellido, nombreUsuario, pass, numTarjeta, cvc, estado) {
        let persona = new Usuario(nombre, apellido, nombreUsuario, pass, numTarjeta, cvc, estado);
        this.listaDeUsuarios.push(persona);
    }

    agregarAlquiler(instancia) {
        let resp = false;
        let objInsta = this.obtenerInstanciaPorNombre(instancia)
        if(objInsta.stock > 0){
            objInsta.stock--;
            let alquiler = new Alquiler(this.usuarioLogeado, objInsta, "encendido", 0);
            this.listaDeAlquiler.push(alquiler);
            resp = true
        }
        
        return resp;
    }

    agregarInstancia(nombre, precioAlquiler, precioEncendido, stock) {
        let instancia = new Instancia(nombre, precioAlquiler, precioEncendido, stock);
        this.listaDeInstancias.push(instancia);
    }

    realizarLoginAdmin(usuario, pass) {
        let ok = false
        for (let i = 0; i < this.listaDeAdmin.length; i++) {
            let adminActual = this.listaDeAdmin[i];
            if (adminActual.usuario.toLowerCase() === usuario.toLowerCase()) {
                if (adminActual.pass === pass) {
                    ok = true;
                    this.usuarioLogeado = adminActual;
                }
            }
        }
        return ok
    }

    realizarLoginUsuario(usuario, pass) {
        let ok = false
        for (let i = 0; i < this.listaDeUsuarios.length; i++) {
            let usuarioActual = this.listaDeUsuarios[i];
            if (usuarioActual.nombreUsuario.toLowerCase() === usuario.toLowerCase()) {
                if (usuarioActual.pass === pass && usuarioActual.estado === "activo") {
                    ok = true;
                    this.usuarioLogeado = usuarioActual;
                }
            }
        }
        return ok;
    }

    realizarLogout() {
        this.usuarioLogeado = null
    }

    existeUsuario(usuario) {
        let resp = null
        for (let i = 0; i < this.listaDeUsuarios.length; i++) {
            let usuarioActual = this.listaDeUsuarios[i];
            if (usuarioActual.nombreUsuario === usuario) {
                resp = usuarioActual
                break
            }
        }
        return resp
    }

    obtenerInstanciaPorNombre(instancia){
        let resp = null
        for (let i = 0; i < this.listaDeInstancias.length; i++) {
            let aux = this.listaDeInstancias[i];
            if (aux.nombre === instancia) {
                resp = aux
                break
            }
        }
        return resp
    }

    existeAdmin(usuario) {
        let resp = null
        for (let i = 0; i < this.listaDeAdmin.length; i++) {
            let usuarioActual = this.listaDeAdmin[i];
            if (usuarioActual.usuario === usuario) {
                resp = usuarioActual
                break
            }
        }
        return resp
    }

    activarUsuario(id) {
        let active = false;
        for (let i = 0; i < this.listaDeUsuarios.length && !active; i++) {
            let usuarioActual = this.listaDeUsuarios[i];
            if (usuarioActual.id === id) {
                usuarioActual.estado = "activo";
                active = true;
            }
        }
    }

    bloquearUsuario(id) {
        let bloquie = false;
        for (let i = 0; i < this.listaDeUsuarios.length && !bloquie; i++) {
            let usuarioActual = this.listaDeUsuarios[i];
            if (usuarioActual.id === id) {
                usuarioActual.estado = "bloqueado";
                bloquie = true;
            }
        }
        for (let i = 0; i < this.listaDeAlquiler.length; i++) {
            let alquilerActual = this.listaDeAlquiler[i];
            if(alquilerActual.usuario.id === id){
                alquilerActual.instancia.stock++;
                this.listaDeAlquiler.splice(i,1);
                i--
            }
        }
    }

    modificarStock(id, num) {
        let cambie = false;
        for (let i = 0; i < this.listaDeInstancias.length && !cambie; i++) {
            let instanciaActual = this.listaDeInstancias[i];
            if (instanciaActual.id === id) {
                instanciaActual.stock = num;
                cambie = true;
            }
        }
    }


    encenderInstancia(id) {
        let active = false;
        for (let i = 0; i < this.listaDeAlquiler.length && !active; i++) {
            let instanciaActual = this.listaDeAlquiler[i];
            if (instanciaActual.id === id) {
                instanciaActual.estado = "encendido";
                instanciaActual.cantEncendidos++
                active = true;
            }
        }
    }

    apagarInstancia(id) {
        let apague = false;
        for (let i = 0; i < this.listaDeAlquiler.length && !apague; i++) {
            let instanciaActual = this.listaDeAlquiler[i];
            if (instanciaActual.id === id) {
                instanciaActual.estado = "apagado";
                apague = true;
            }
        }
    }

    obtenerMisAlquileres(){
        let lista = [];
        for (let i = 0; i < this.listaDeAlquiler.length; i++) {
            let alquilerActual = this.listaDeAlquiler[i];
            if (alquilerActual.usuario === this.usuarioLogeado) {
               lista.push(alquilerActual) 
            }
        }
        return lista
    }
}

let idAlquiler = 0;
class Alquiler {
    constructor(usuarioLogeado, instancia, estado, cantEncendidos) {
        this.id = idAlquiler++;
        this.usuario = usuarioLogeado;
        this.instancia = instancia;
        this.estado = estado;
        this.cantEncendidos = cantEncendidos;
    }
    obtenerCosto(){
        return this.instancia.precioAlquiler + this.instancia.precioEncendido * this.cantEncendidos;
    }
}

let idInstancia = 0;
class Instancia {
    constructor(nombre, precioAlquiler, precioEncendido, stock) {
        this.id = idInstancia++;
        this.nombre = nombre;
        this.precioAlquiler = precioAlquiler;
        this.precioEncendido = precioEncendido;
        this.stock = stock;
    }

}

let idUsuario = 1;
class Usuario {
    constructor(nombre, apellido, nombreUsuario, pass, numTarjeta, cvc, estado) {
        this.nombre = nombre
        this.apellido = apellido
        this.nombreUsuario = nombreUsuario
        this.pass = pass
        this.numTarjeta = numTarjeta
        this.cvc = cvc
        this.estado = estado
        this.id = idUsuario++
    }
}

let idAdministrador = 1;
class Administrador {
    constructor(usuario, pass) {
        this.usuario = usuario
        this.pass = pass
        this.id = idAdministrador++
    }
}
