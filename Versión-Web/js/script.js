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
        // Similar a re.sub(r'[^\x20-\x7E\xA1-\xFF]', r'', texto) en Python.
        // Permite caracteres ASCII imprimibles y un rango común para caracteres acentuados.
        // Nota: JavaScript no tiene un soporte de expresiones regulares idéntico a Python para rangos de bytes directos,
        // pero \x20-\x7E cubre el ASCII básico. Para caracteres extendidos (como á, é, ñ), String.fromCharCode()
        // ya los manejará si el charCode es correcto. La limpieza adicional es para el caso de caracteres inválidos.
        const textoLimpio = texto.replace(/[^\x20-\x7E\xA0-\xFF]/g, ''); // \xA0-\xFF cubre parte de Latin-1 Suppl.

        return textoLimpio;
    } catch (e) {
        // Esto captura errores que podrían ocurrir si parseInt falla inesperadamente,
        // aunque la validación inicial ya debería manejar la mayoría de los casos.
        return "Error al decodificar. Asegúrate de que el formato binario sea correcto.";
    }
}


// --- Interacción con la Interfaz de Usuario (Equivalente a main.py) ---

// Obtener referencias a los elementos del DOM (Document Object Model)
const messageInput = document.getElementById('message-input');
const resultOutput = document.getElementById('result-output');
const encodeBtn = document.getElementById('encode-btn');
const decodeBtn = document.getElementById('decode-btn');
const clearBtn = document.getElementById('clear-btn');

// Función para mostrar el resultado
function mostrarResultado(resultado) {
    resultOutput.value = resultado; // Asigna el resultado al valor del textarea
    // En JS no necesitas deshabilitar/habilitar para escribir, simplemente asignas el valor.
    // El 'readonly' en el HTML ya se encarga de que el usuario no lo edite.
}

// Función para limpiar ambos campos
function limpiarCampos() {
    messageInput.value = ''; // Limpia el campo de entrada
    resultOutput.value = ''; // Limpia el campo de resultado
    messageInput.focus(); // Opcional: vuelve a poner el foco en el campo de entrada
}

// Event Listeners para los botones
encodeBtn.addEventListener('click', () => {
    const mensaje = messageInput.value.trim(); // .trim() elimina espacios en blanco al inicio/final
    const resultado = codificar(mensaje);
    mostrarResultado(resultado);
});

decodeBtn.addEventListener('click', () => {
    const binario = messageInput.value.trim();
    const resultado = decodificar(binario);
    mostrarResultado(resultado);
});

clearBtn.addEventListener('click', limpiarCampos);

// Opcional: Habilitar Copy/Paste con Ctrl+C/Ctrl+V en el campo de salida (si estuviera editable)
// Para los textareas, el navegador ya maneja Ctrl+C/V por defecto,
// pero puedes añadirlo si quisieras personalizar o añadir atajos globales.
// No es necesario en este caso ya que `resultOutput` es `readonly`.