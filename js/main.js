// Simulador de préstamo
// Arreglo con pares de Capital-Tasa que define la empresa prestadora
let tasas = [{capital:2000000, tasa:10}, {capital:1000000, tasa:8}, {capital:500000, tasa:7}, {capital:100000, tasa:5}]

class Cliente{
    constructor(nombre, apellido, dni, telefono, email, capital, plazo, tasa) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.telefono = telefono;
        this.email = email;
        this.capital = capital;
        this.plazo = plazo;
        this.tasa = tasa;
        this.fecha = this.asignarFecha(); 
    }
    asignarFecha(){ 
        let hoy = new Date();
        return hoy.toLocaleDateString();
    }
}

const btnNvoPrestamo = document.getElementById("btn-crear-prestamo");
btnNvoPrestamo.addEventListener("click", crearNvoPrestamo);
let sumaTotalCuota; 

// Función que crea un préstamo y lo guarda en el session storage.
function crearNvoPrestamo (e) {
    e.preventDefault();
    let capitalNvoPrestamo = parseInt(document.getElementById("capital").value);
    let plazoNvoPrestamo = parseInt(document.getElementById("plazo").value);
    let tasaNvoPrestamo = 0;
    if ( !(isNaN(capitalNvoPrestamo) || (capitalNvoPrestamo <= 0)) &&  !(isNaN(plazoNvoPrestamo) || (plazoNvoPrestamo <= 0))) {
        // Ordeno y luego recorro el arreglo para determinar la tasa en función al monto solicitado.
        tasas.sort((a, b) => {
            return b.capital - a.capital;
        })
        tasas.forEach((obj) => {
            if (capitalNvoPrestamo <= obj.capital) {
                tasaNvoPrestamo = obj.tasa;
            } else {
                tasaNvoPrestamo = tasas[0].tasa;
            }             
        })
        const prestamo = {
            capital: capitalNvoPrestamo, 
            plazo: plazoNvoPrestamo, 
            tasa: tasaNvoPrestamo,
        };
        // Guardo estos datos en el Session Storage.
        sessionStorage.setItem("capital", capitalNvoPrestamo);
        sessionStorage.setItem("plazo", plazoNvoPrestamo);
        sessionStorage.setItem("tasa", tasaNvoPrestamo);
        detallePrestamo(prestamo);
    }
}

// Función que devuelve una colección de cuotas detalladas según el préstamo de entrada.
function detallePrestamo(prestamo) {
    const iva = 21/100;
    let cuota = {};
    cuota.numCuota = 1;
    cuota.capRestante = Math.round(100 * prestamo.capital)/100;
    cuota.cuotaPura = Math.round(100 * prestamo.capital * (prestamo.tasa / 1200) / (1 - ((1 + (prestamo.tasa / 1200)) ** (-prestamo.plazo))))/100;
    sessionStorage.setItem("cuotaPura", cuota.cuotaPura);
    cuota.totalCuota = Math.round(100 * cuota.cuotaPura + (prestamo.capital * (prestamo.tasa / 1200) * iva))/100;
    sumaTotalCuota = cuota.totalCuota; 
    let detalle = [];
    detalle.push(cuota);
    for (let i = 1; i < prestamo.plazo; i++) {
        cuota = {};
        cuota.numCuota = (i + 1);
        cuota.capRestante = Math.round(100 * (detalle[i-1].capRestante * (1 + (prestamo.tasa / 1200)) - detalle[i-1].cuotaPura))/100;
        cuota.cuotaPura = Math.round(100 * detalle[i-1].cuotaPura)/100;
        cuota.totalCuota = Math.round(100 * (detalle[i-1].cuotaPura + (detalle[i-1].capRestante * (prestamo.tasa / 1200) * iva)))/100;
        sumaTotalCuota += cuota.totalCuota;
        detalle.push(cuota);       
    }
    sessionStorage.setItem("totalDevolver", sumaTotalCuota);
    mostrarDetalle(detalle);
}

// Función que presenta en pantalla el detalle de cuotas.
function mostrarDetalle(detalle) {
    const muestraDetalle = document.getElementsByClassName("detalle");
    muestraDetalle[0].innerHTML = "<h2>Detalle del préstamo solicitado</h2>";
    let registroCuota = document.createElement("div");
    registroCuota.classList = "tabla"
    registroCuota.innerHTML += `       
        <div class="titulo cuota">
            <h3>Cuota Número</h3>
            <h3>Capital Restante</h3>
            <h3>Cuota Pura</h3>
            <h3>Total Cuota</h3>
        </div>
        `    
    detalle.forEach(cuota => {
        registroCuota.innerHTML += `
            <div class="cuota">
                <h4>${cuota.numCuota}</h4>
                <h4>${cuota.capRestante}</h4>
                <h4>${cuota.cuotaPura}</h4>
                <h4>${cuota.totalCuota}</h4>
            </div>
        `
    })
    muestraDetalle[0].appendChild(registroCuota);
    mostrarResumen();
    pedirDatosCliente();
}

// Función que presenta el resumen del préstamo en pantalla.
function mostrarResumen() {
    const muestraResumen = document.getElementsByClassName("resumen");
    let capitalSS = sessionStorage.getItem("capital");
    let plazoSS = sessionStorage.getItem("plazo");
    let tasaSS = sessionStorage.getItem("tasa");
    let totalDevolverlSS = Math.round( 100 * sessionStorage.getItem("totalDevolver")) / 100;
    let cuotaPuraSS = sessionStorage.getItem("cuotaPura");
    let comisionOtorgamiento = Math.round( 100 * cuotaPuraSS * plazoSS * 0.04) / 100;
    let sellado = Math.round( 100 * cuotaPuraSS * plazoSS * 0.005) / 100;
    let sueldoMinimo = Math.round(cuotaPuraSS * 10 / 3);
    muestraResumen[0].innerHTML = `<h2>Resumen del préstamo solicitado</h2>
                                   <h3>Capital: $${capitalSS}</h3> 
                                   <h3>Plazo de la operación: ${plazoSS} meses</h3> 
                                   <h3>Tasa de Interés: ${tasaSS} %</h3> 
                                   <h3>Monto total a devolver: $${totalDevolverlSS}</h3> 
                                   <h3>Valor de la Cuota Pura: $${cuotaPuraSS}</h3> 
                                   <h3>Comisión Otorgamiento (4 %): $${comisionOtorgamiento}</h3> 
                                   <h3>Sellado (0,5 %): $${sellado}</h3>                                    
                                   <h3 id="sueldoMinimo">Sueldo Mensual mínimo requerido: $${sueldoMinimo}</h3>                                    
    `;
}

// Función que pide los datos del cliente.
function pedirDatosCliente() {
    const datosCliente = document.getElementById("datosCliente");
    datosCliente.innerHTML = `<h2>Desea registrar sus datos para ponernos en contacto con usted?</h2>
                              <label for="nombre">Nombre </label>
                              <input type="text" name="nombre" id="nombre">
                              <label for="apellido">Apellido </label>
                              <input type="text" name="apellido" id="apellido">
                              <label for="dni">DNI </label>
                              <input type="number" name="dni" id="dni">
                              <br/>
                              <label for="telefono">Teléfono </label>
                              <input type="number" name="telefono" id="telefono">
                              <label for="email">Dirección de correo </label>
                              <input type="text" name="email" id="email">
                              <button id="btn-crear-cliente" class="btn btn-warning">Registrar</button>
    `;
    const btnNvoCliente = document.getElementById("btn-crear-cliente");
    btnNvoCliente.addEventListener("click", crearNvoCliente);
}

// Función que crea al cliente y lo guarda en el local storage.
function crearNvoCliente(e){
    e.preventDefault();
    let nombreNvoCliente = document.getElementById("nombre").value;
    let apellidoNvoCliente = document.getElementById("apellido").value;
    let dniNvoCliente = document.getElementById("dni").value;
    let telefonoNvoCliente = document.getElementById("telefono").value;
    let emailNvoCliente = document.getElementById("email").value;
    let capitalNvoCliente = sessionStorage.getItem("capital");
    let plazoNvoCliente = sessionStorage.getItem("plazo");
    let tasaNvoCliente = sessionStorage.getItem("tasa");
    if (nombreNvoCliente != "" && apellidoNvoCliente != "" && (dniNvoCliente != "" && (dniNvoCliente > 0)) && (telefonoNvoCliente != "" && (telefonoNvoCliente > 0)) && emailNvoCliente != "") {
        let cliente = new Cliente(nombreNvoCliente, apellidoNvoCliente, dniNvoCliente, telefonoNvoCliente, emailNvoCliente, capitalNvoCliente, plazoNvoCliente, tasaNvoCliente);
        let clientes = [];
        if (localStorage.getItem("clientes") !== null) {
            clientesRecuperados = JSON.parse(localStorage.getItem("clientes"));
            clientes.push(clientesRecuperados);
            clientes.push(cliente);
        } else {
            clientes = cliente;
        };
        localStorage.setItem("clientes", JSON.stringify(clientes));
        // alert("Cliente registrado");
        Toastify({
            text: "Cliente registrado",
            duration: 3000,
            gravity: `bottom`,
            style: {
                background: "linear-gradient(90deg, rgba(255,171,0,1) 0%, rgba(171,0,255,1) 100%)",
                color: "rgb(235, 235, 235)",
                padding: "10px",
            }
          }).showToast();
    }
};
