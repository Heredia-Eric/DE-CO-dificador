// --- Lógica de Codificación y Decodificación (Equivalente a DECOdificador.py) ---

/**
 * Codifica un texto plano a una cadena binaria (ASCII de 8 bits por carácter).
 * @param {string} texto El texto a codificar.
 * @returns {string} La cadena binaria codificada.
 */
function codificar(texto) {
    if (!texto) {
        return "";
    }
    let binario = '';
    for (let i = 0; i < texto.length; i++) {
        const charCode = texto.charCodeAt(i); // Obtiene el valor ASCII (o Unicode) del carácter
        // Convierte el valor ASCII a binario y asegura que tenga 8 bits, rellenando con ceros a la izquierda
        binario += charCode.toString(2).padStart(8, '0');
    }
    return binario;
}

/**
 * Decodifica una cadena binaria a texto plano.
 * Intenta limpiar caracteres no imprimibles.
 * @param {string} binario La cadena binaria a decodificar.
 * @returns {string} El texto decodificado o un mensaje de error si el binario no es válido.
 */
function decodificar(binario) {
    // Validar que la cadena binaria solo contenga '0' y '1' y sea múltiplo de 8
    if (!/^[01]+$/.test(binario) || binario.length % 8 !== 0) {
        return "El código binario ingresado no es válido. Asegúrate de que solo contenga '0' y '1' y su longitud sea múltiplo de 8.";
    }

    let texto = '';
    try {
        for (let i = 0; i < binario.length; i += 8) {
            const byte = binario.substring(i, i + 8); // Extrae un segmento de 8 bits
            const charCode = parseInt(byte, 2); // Convierte el binario de 8 bits a su valor decimal
            texto += String.fromCharCode(charCode); // Convierte el valor decimal a carácter
        }

        // Limpiar caracteres no imprimibles o problemáticos.
        const textoLimpio = texto.replace(/[^\x20-\x7E\xA0-\xFF]/g, '');

        return textoLimpio;
    } catch (e) {
        return "Error al decodificar. Asegúrate de que el formato binario sea correcto.";
    }
}


// --- Interacción con la Interfaz de Usuario ---

// Obtener referencias a los elementos del DOM
const messageInput = document.getElementById('message-input');
const resultOutput = document.getElementById('result-output');

// Referencias a los botones
const encodeBtn = document.getElementById('encode-btn');
const decodeBtn = document.getElementById('decode-btn');
const copyBtn = document.getElementById('copy-btn');
// const pasteBtn = document.getElementById('paste-btn'); // Comentado: el paste-btn no está en tu HTML actual
const clearBtn = document.getElementById('clear-btn');


// --- Inicio de Verificación y Depuración para el botón Limpiar ---
// Verificamos si el botón 'Limpiar' fue encontrado en el DOM
if (clearBtn) {
    console.log("DEBUG: Botón Limpiar con id='clear-btn' encontrado en el DOM:", clearBtn);
} else {
    console.error("ERROR: No se pudo encontrar el botón Limpiar con id='clear-btn'. Asegúrate de que el ID esté correcto en tu HTML.");
}
// --- Fin de Verificación y Depuración ---


// Función para mostrar el resultado en el campo de salida
function mostrarResultado(resultado) {
    resultOutput.value = resultado;
}

// Función para limpiar AMBOS campos (entrada y salida)
function limpiarCampos() {
    debugger; // Pausará la ejecución aquí cuando la función sea llamada
    messageInput.value = ''; // Limpia el campo de entrada
    resultOutput.value = ''; // Limpia el campo de resultado
    messageInput.focus();    // Vuelve a poner el foco en el campo de entrada
    console.log("DEBUG: Función limpiarCampos ejecutada. Campos deberían estar limpios.");
}

// Función para copiar el contenido del campo "Resultado" al portapapeles
async function copiarResultado() {
    try {
        await navigator.clipboard.writeText(resultOutput.value);

        // Efecto visual: Cambiar texto del botón a "✓ Copiado" y luego restaurar
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copiado';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 1500);

    } catch (err) {
        console.error('Error al copiar el texto: ', err);
        alert('No se pudo copiar el texto. Asegúrate de que tu navegador soporte la API del portapapeles o que la página tenga foco.');
    }
}

// Event Listeners para los botones
encodeBtn.addEventListener('click', () => {
    const mensaje = messageInput.value.trim();
    const resultado = codificar(mensaje);
    mostrarResultado(resultado);
});

decodeBtn.addEventListener('click', () => {
    const binario = messageInput.value.trim();
    const resultado = decodificar(binario);
    mostrarResultado(resultado);
});

// Listener para el botón Copiar
copyBtn.addEventListener('click', copiarResultado);

// Listener para el botón Pegar (ya no está en tu HTML, así que este código es redundante si no lo añades de nuevo)
// if (pasteBtn) { // Solo si el botón fue encontrado, añade el listener
//     pasteBtn.addEventListener('click', () => {
//         console.log("El botón 'Pegar' no realiza ninguna acción en esta versión.");
//     });
// } else {
//     console.log("DEBUG: El botón 'Pegar' (id='paste-btn') no fue encontrado en el DOM, su listener no se adjuntó.");
// }


// --- Listener para el botón Limpiar ---
// Solo adjuntamos el listener si el botón fue encontrado (para evitar errores si el ID es incorrecto)
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        debugger; // <-- PAUSA AQUÍ CUANDO SE HAGA CLIC EN LIMPIAR
        console.log("DEBUG: ¡Se hizo clic en el botón Limpiar!");
        limpiarCampos();
    });
} else {
    console.error("No se pudo asignar el listener al botón Limpiar porque la referencia 'clearBtn' es null.");
}