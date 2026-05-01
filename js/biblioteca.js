function ocultarDiv(id) {
    document.querySelector("#" + id).style.display = "none";
}

function mostrarDiv(id) {
    document.querySelector("#" + id).style.display = "block";
}

function get(id) {
    return document.querySelector("#" + id);
}

function ocultarDivs() {
    ocultarDiv("divUsuario")
    ocultarDiv("divAdmin")
}

function sonLetras(palabra) {
    let hayLetras = true;
    for (let i = 0; i < palabra.length && hayLetras; i++) {
        if (!isNaN(palabra[i]) && palabra[i] === palabra[i].toUpperCase()) {
            hayLetras = false;
        }
    }
    return hayLetras;
}

function chequeoPass(pass) {
    let passValida = false;
    let contieneMayuscula = false;
    let contieneMinuscula = false;
    let contieneNumero = false;
    let mensaje = "";

    if (pass.length >= 5 && pass.length <=30) {
        for (let i = 0; i < pass.length; i++) {
            let codigo = pass[i].charCodeAt(0);

            if (codigo >= 65 && codigo <= 90) {
                contieneMayuscula = true;
            }

            if (codigo >= 97 && codigo <= 122) {
                contieneMinuscula = true;
            }

            if (codigo >= 48 && codigo <= 57) {
                contieneNumero = true;
            }
        }

        if (!contieneMayuscula) {
            mensaje = "La contraseña debe contener al menos una mayúscula <br>";
        }
        if (!contieneMinuscula) {
            mensaje += "La contraseña debe contener al menos una minúscula <br>";
        }
        if (!contieneNumero) {
            mensaje += "La contraseña debe contener al menos un número";
        }
        if (contieneMayuscula && contieneMinuscula && contieneNumero) {
            passValida = true;
        }
    } else {
        mensaje = "La contraseña debe contener al menos 5 caracteres";
    }
    return [passValida, mensaje];
}

function chequeoTarjeta(numTarjeta) {
    let tarValida = false
    if (numTarjeta.length === 19 && numTarjeta.charAt(4) === "-" && numTarjeta.charAt(9) === "-" &&
        numTarjeta.charAt(14) === "-") {
        numTarjetaSinGuion = numTarjeta.replaceAll("-", "");
        if (!isNaN(numTarjetaSinGuion) && algoritmoLuhn(numTarjetaSinGuion)) {
            tarValida = true
        }
    }
    return tarValida
}

function algoritmoLuhn(pNumero) {
    let suma = 0;
    let digitoVerificadorX = Number(pNumero.charAt(pNumero.length - 1));
    let contador = 0;
    let haynro = true;
    let i = pNumero.length - 2;
    while (i >= 0 && haynro) {
        let caracter = pNumero.charAt(i);
        if (!isNaN(caracter)) {
            let num = Number(caracter);
            if (contador % 2 == 0) {
                num = duplicarPar(num);
            }
            suma += num;
        } else {
            haynro = false;
        }
        i--;
        contador++;
    }
    let digitoVerificadorValido = checkDigito(suma, digitoVerificadorX);
    let modulodelasumaValiado = checkModulo(suma, digitoVerificadorX);
    return digitoVerificadorValido && modulodelasumaValiado;

}

function duplicarPar(pNum) {
    pNum = pNum * 2;
    if (pNum > 9) {
        pNum = 1 + (pNum % 10);
    }
    return pNum;
}

function checkDigito(pSuma, pDigito) {
    let total = 9 * pSuma;
    let ultimoNro = total % 10
    return ultimoNro === pDigito;
}

function checkModulo(pSuma, pDigito) {
    let total = pSuma + pDigito;
    let validacionFinal = false;
    if (total % 10 === 0 && total !== 0) {
        validacionFinal = true;
    }
    return validacionFinal;
}

function cargarUsuariosCombo(select, estado) {
    let validar = ""
    for (let i = 0; i < sistema.listaDeUsuarios.length; i++) {
        let usuario = sistema.listaDeUsuarios[i];
        if (usuario.estado === estado) {
            validar += `<option value="${usuario.id}">${usuario.nombreUsuario}</option>`;
        }
    }
    get(select).innerHTML = validar;
}

function actualizarSeccionAdmin(){
    cargarUsuariosCombo("selectParaValidar", "pendiente")
    cargarUsuariosCombo("selectParaBloquear", "activo")
    cargarUsuariosCombo("selectParaDesbloquear", "bloqueado")
    cargarStockCombo()
    obtenerCostoTotalAdmin()
}

function actualizarSeccionUsuario(){
    listadoDeInstancias();
    obtenerCostoPorInstancia();
}
