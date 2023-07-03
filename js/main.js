// Simulador de préstamo
class Prestamo{
    constructor(capital, plazo, tasa, agencia) {
        this.capital = capital;
        this.plazo = plazo;
        this.tasa = tasa;
        this.agencia = agencia;
        this.fecha = this.asignarFecha(); 
    }
    asignarFecha(){ 
        let hoy = new Date();
        return hoy.toLocaleDateString();
    }
    mostrarAlta() {
        return `Datos del préstamo solicitado por la agencia ${this.agencia} al día: ${this.fecha}
        Capital requerido: ${this.capital}
        Plazo: ${this.plazo} cuotas
        TNA: ${this.tasa} %`;
    }
}
// Función que devuelve una colección de cuotas detalladas según el préstamo de entrada.
function detallePrestamo(prestamo) {
    const iva = 21/100;
    let cuota = {};
    cuota.numCuota = 1;
    cuota.capRestante = Math.round(100 * prestamo.capital)/100;
    cuota.cuotaPura = Math.round(100 * prestamo.capital * (prestamo.tasa / 1200) / (1 - ((1 + (prestamo.tasa / 1200)) ** (-prestamo.plazo))))/100;
    cuota.totalCuota = Math.round(100 * cuota.cuotaPura + (prestamo.capital * (prestamo.tasa / 1200) * iva))/100;
    console.log(cuota);
    let detalle = [];
    detalle.push(cuota);
    for (let i = 1; i < prestamo.plazo; i++) {
        cuota.numCuota = (i + 1);
        cuota.capRestante = Math.round(100 * (detalle[i-1].capRestante * (1 + (prestamo.tasa / 1200)) - detalle[i-1].cuotaPura))/100;
        cuota.cuotaPura = Math.round(100 * detalle[i-1].cuotaPura)/100;
        cuota.totalCuota = Math.round(100 * (detalle[i-1].cuotaPura + (detalle[i-1].capRestante * (prestamo.tasa / 1200) * iva)))/100;
        console.log(cuota);
        detalle.push(cuota);
    }
    return detalle;
}
// Menú principal que da inicio al simulador.
function administrarPrestamos() {
    let opcion = "";
    let prestamo = "";
    let registroPrestamos = [/*{capital: 1000, plazo: 12, tasa: 10, agencia: "Primero S.A.", fecha: "1/8/2022"},
                                {capital: 2000, plazo: 24, tasa: 20, agencia: "Segundo S.A.", fecha: "6/12/2021"},
{capital: 3000000, plazo: 12, tasa: 86.45, agencia: "Tercero S.A.", fecha: "12/7/2023"}*/];
    do{
        opcion = prompt(`Seleccione una opción:
        1. Agregar nuevo préstamo.
        2. Eliminar préstamo.
        3. Ver préstamos cargados.
        4. Ver detalle del pago de un préstamo.
        99. Salir.`);
        switch(opcion) {
            case "1":
                let capital = parseFloat(prompt("Ingrese Monto del préstamo solicitado:"));
                while ((isNaN(capital)) || (capital <= 0)) {
                    capital = parseFloat(prompt(`Capital incorrecto! Por favor, reingrese Monto del préstamo solicitado:`));
                }
                let plazo = parseInt(prompt("Ingrese la cantidad de cuotas:"));
                while ((isNaN(plazo)) || (plazo <= 0)) {
                    plazo = parseInt(prompt(`Cantidad de cuotas incorrecta! Por favor, reingrese la cantidad de cuotas:`));
                }
                let tasa = parseFloat(prompt("Ingrese la Tasa Nominal Anual:"));
                while ((isNaN(tasa)) || (tasa <= 0)) {
                    tasa = parseFloat(prompt(`Tasa Nominal Anual incorrecta! Por favor, reingrese la Tasa Nominal Anual:`));
                }
                let agencia = prompt("Ingrese la Agencia solicitante:");
                prestamo = new Prestamo(capital, plazo, tasa, agencia);
                alert(prestamo.mostrarAlta());
                registroPrestamos.push(prestamo);
                break;
            case "2":
                // Se verifica que el array registroPrestamos no esté vacío.
                if (registroPrestamos.length == 0) {
                    alert("No hay préstamos para eliminar. Por favor, vuelva al menu y seleccione la opción 1 para agregar un préstamo nuevo.");
                } else {
                    let id = parseInt(prompt("Ingrese el id del préstamo que desea eliminar."));
                    // Se verifica que la condición se ingrese correctamente.
                    while ( !( (id < registroPrestamos.length) && (id >= 0) && !(isNaN(id)) ) ) { 
                        id = parseInt(prompt(`Respuesta incorrecta! Ingrese el id del préstamo que desea eliminar.`));
                    }
                    let decision = prompt(`Está por eliminar el préstamo por $${registroPrestamos[id].capital} de la Agencia ${registroPrestamos[id].agencia}? (si / no)`);
                    // Se verifica que la condición se ingrese correctamente.
                    while (decision != "si" && decision != "no") {
                        decision = prompt(`Respuesta incorrecta! Está por eliminar el préstamo por $${registroPrestamos[id].capital} de la Agencia ${registroPrestamos[id].agencia}? (si / no)`);
                    }
                    if (decision === "si") {
                        const capitalEliminado = registroPrestamos[id].capital;
                        const agenciaEliminada = registroPrestamos[id].agencia;
                        registroPrestamos.splice(id,1);   
                        alert(`El préstamo por $${capitalEliminado} de la Agencia ${agenciaEliminada} ha sido eliminado`);
                    } else {
                        alert(`No se ha eliminado ningún préstamo. Vuelva al menú inicial`);
                    }
                }
                break;
            case "3":
                // Se verifica que el array registroPrestamos no esté vacío.
                if (registroPrestamos.length == 0) {
                    alert("No hay préstamos cargados. Por favor, vuelva al menu y seleccione la opción 1 para agregar un préstamo nuevo.");
                } else {
                registroPrestamos.forEach((element, index) => console.log(`Indice: ${index} - Agencia: ${element.agencia} - Préstamo: ${element.capital}`));
                }
                break;
            case "4":
                // Se verifica que el array registroPrestamos no esté vacío.
                if (registroPrestamos.length == 0) {
                    alert("No hay préstamos para mostrar detalle. Por favor, vuelva al menu y seleccione la opción 1 para agregar un préstamo nuevo.");
                } else {
                    let id = parseInt(prompt("Ingrese el id del préstamo que desea ver el detalle."));             
                    // Se verifica que la condición se ingrese correctamente.
                    while ( !( (id < registroPrestamos.length) && (id >= 0) && !(isNaN(id)) ) ) { 
                        id = parseInt(prompt(`Respuesta incorrecta! Ingrese el id del préstamo que desea ver el detalle.`));         
                    };
                    detallePrestamo(registroPrestamos[id]);
                }
                break;
            case "99":
                break;
        }
    }while(opcion !== "99")
}

administrarPrestamos();