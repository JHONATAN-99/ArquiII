// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAXNQdj_tJ_siPr5w_WddQuNpDSZiETE70",
    authDomain: "info2024-5130d.firebaseapp.com",
    databaseURL: "https://info2024-5130d-default-rtdb.firebaseio.com",
    projectId: "info2024-5130d",
    storageBucket: "info2024-5130d.appspot.com",
    messagingSenderId: "43657857517",
    appId: "1:43657857517:web:8861b624f1c514dcfbffe4",
    measurementId: "G-LBB34NTTW7"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencia a la base de datos
const dbRef = firebase.database().ref();

// Variable para almacenar temperatura anterior
let tempAnterior = null;

// Escuchar cambios en los datos de Firebase
dbRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        const temp1 = data.Temperatura1;

        document.getElementById('temperatura1').textContent = temp1.toFixed(1) + ' °C';
        tempAnterior = temp1; // Guardar la temperatura actual
    } else {
        console.log('No se encontraron datos en la base de datos.');
    }
});

// Función para mostrar todas las temperaturas guardadas
function mostrarTemperaturas() {
    const listaTemperaturas = document.getElementById('listaTemperaturas');
    listaTemperaturas.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

    dbRef.child('temperaturas').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const temperatura = childSnapshot.val();
            const li = document.createElement('li');
            li.textContent = `Temperatura: ${temperatura.Temperatura1} °C (Guardado el ${new Date(temperatura.timestamp).toLocaleString()})`;
            listaTemperaturas.appendChild(li);
        });
    });
}

// Función para mostrar la pestaña de temperaturas y ocultar el monitor
function mostrarPestanaTemperaturas() {
    document.getElementById('monitor-section').style.display = 'none';
    document.getElementById('temperaturas-section').style.display = 'block';
    mostrarTemperaturas(); // Llama a la función que obtiene y muestra las temperaturas
}

// Función para volver al monitor y ocultar la pestaña de temperaturas
function volverAlMonitor() {
    document.getElementById('temperaturas-section').style.display = 'none';
    document.getElementById('monitor-section').style.display = 'block';
}

// Función para actualizar la fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    document.getElementById('fecha-hora').textContent = ahora.toLocaleString();
}

// Funciones para controlar el logging
function iniciarLogging() {
    document.getElementById('estado-loggin').textContent = 'Iniciado';
}

function detenerLogging() {
    document.getElementById('estado-loggin').textContent = 'Detenido';
}

// Función para agregar datos a la base de datos
function agregarDatos(temperatura) {
    const nuevoRegistroRef = dbRef.child('temperaturas').push();
    nuevoRegistroRef.set({
        Temperatura1: temperatura,
        timestamp: firebase.database.ServerValue.TIMESTAMP // Guarda la marca de tiempo del registro
    })
    .then(() => {
        console.log("Datos agregados exitosamente.");
        // No se llama a mostrarTemperaturas aquí
    })
    .catch((error) => {
        console.error("Error al agregar datos: ", error);
    });
}

// Función para guardar el dato de temperatura
function guardarDato() {
    agregarDatos(tempAnterior); // Guarda la temperatura anterior al presionar el botón
}

// Función para borrar todos los datos guardados en la base de datos
function borrarTodosLosDatos() {
    const temperaturasRef = dbRef.child('temperaturas');

    temperaturasRef.remove()
    .then(() => {
        console.log("Todos los datos han sido borrados exitosamente.");
        mostrarTemperaturas(); // Actualiza la lista para reflejar que no hay datos
    })
    .catch((error) => {
        console.error("Error al borrar los datos: ", error);
    });
}

// Actualizar fecha y hora cada segundo
setInterval(actualizarFechaHora, 1000);

// Inicializar la fecha y hora al cargar la página
actualizarFechaHora();

// Captura el formulario de login y añade un evento al enviar
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que se envíe el formulario tradicionalmente

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === "admin" && password === "1234") {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('monitor-section').style.display = 'block';
    } else {
        alert("Credenciales incorrectas. Intenta nuevamente.");
    }
});
