// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // --- Referencias a elementos del DOM ---
    const form = document.getElementById('conceptoForm');
    const nombreInput = document.getElementById('nombre');
    const definicionInput = document.getElementById('definicion');
    const listaConceptos = document.getElementById('listaConceptos');
    const mensaje = document.getElementById('mensaje');
    const btnCargar = document.getElementById('btnCargar');
    const btnEliminarTodos = document.getElementById('btnEliminarTodos');

    // URL base de la API
    const API_BASE = '/api/conceptos';

    // --- Función para mostrar mensajes en pantalla ---
    function mostrarMensaje(texto, tipo = 'info') {
        mensaje.style.display = 'block';
        mensaje.textContent = texto;
        mensaje.className = `mensaje ${tipo}`;
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, 5000);
    }

    // --- Función genérica para hacer peticiones HTTP ---
    async function hacerPeticion(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en petición:', error);
            throw error;
        }
    }

    // --- Función para cargar y mostrar todos los conceptos ---
    async function cargarConceptos() {
        try {
            mostrarMensaje('Cargando conceptos...', 'info');
            
            const conceptos = await hacerPeticion(API_BASE);
            mostrarConceptos(conceptos);
            
            mostrarMensaje(`Se cargaron ${conceptos.length} conceptos`, 'success');
        } catch (error) {
            mostrarMensaje('Error al cargar los conceptos', 'error');
            console.error('Error:', error);
        }
    }

    // --- Función que muestra los conceptos en la página ---
    function mostrarConceptos(conceptos) {
        // Limpiar la lista actual
        listaConceptos.innerHTML = '';

        // Si no hay conceptos, mostrar estado vacío
        if (conceptos.length === 0) {
            listaConceptos.innerHTML = `
                <div class="empty-state">
                    <h3>No hay conceptos guardados</h3>
                    <p>Utiliza el formulario de arriba para agregar tu primer concepto</p>
                </div>
            `;
            return;
        }

        // Crear tarjetas para cada concepto
        conceptos.forEach(concepto => {
            const conceptoCard = crearTarjetaConcepto(concepto);
            listaConceptos.appendChild(conceptoCard);
        });
    }

    // --- Función que crea una tarjeta visual de un concepto ---
    function crearTarjetaConcepto(concepto) {
        const card = document.createElement('div');
        card.className = 'concepto-card';
        card.dataset.id = concepto.id;

        // Formatear fecha
        const fecha = new Date(concepto.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Estructura de la tarjeta
        card.innerHTML = `
            <h3>${escapeHtml(concepto.nombre)}</h3>
            <p>${escapeHtml(concepto.definicion)}</p>
            <div class="concepto-meta">
                ID: ${concepto.id} | Creado: ${fecha}
            </div>
            <div class="concepto-actions">
                <button class="btn btn-secondary btn-small" onclick="obtenerConcepto(${concepto.id})">
                    Ver Detalles
                </button>
                <button class="btn btn-danger btn-small" onclick="eliminarConcepto(${concepto.id})">
                    Eliminar
                </button>
            </div>
        `;

        return card;
    }

    // Función para escapar HTML y prevenir XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Función para agregar un nuevo concepto
    async function agregarConcepto(nombre, definicion) {
        try {
            const nuevoConcepto = {
                nombre: nombre.trim(),
                definicion: definicion.trim()
            };

            const concepto = await hacerPeticion(API_BASE, {
                method: 'POST',
                body: JSON.stringify(nuevoConcepto)
            });

            mostrarMensaje(`Concepto "${concepto.nombre}" agregado exitosamente`, 'success');
            
            // Limpiar formulario
            form.reset();
            
            // Recargar la lista de conceptos
            await cargarConceptos();

        } catch (error) {
            mostrarMensaje('Error al agregar el concepto', 'error');
            console.error('Error:', error);
        }
    }

    // --- Función para obtener un concepto específico ---
    window.obtenerConcepto = async function(id) {
        try {
            const concepto = await hacerPeticion(`${API_BASE}/${id}`);
            
            // Mostrar detalles en un alert 
            alert(`DETALLES DEL CONCEPTO\n\nID: ${concepto.id}\nNombre: ${concepto.nombre}\nDefinición: ${concepto.definicion}\nFecha: ${new Date(concepto.fecha).toLocaleString('es-ES')}`);
            
            mostrarMensaje(`Concepto "${concepto.nombre}" consultado`, 'info');
        } catch (error) {
            mostrarMensaje('Error al obtener el concepto', 'error');
            console.error('Error:', error);
        }
    };

    // --- Función para eliminar un concepto específico ---
    window.eliminarConcepto = async function(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este concepto?')) {
            return;
        }

        try {
            await hacerPeticion(`${API_BASE}/${id}`, {
                method: 'DELETE'
            });

            mostrarMensaje('Concepto eliminado exitosamente', 'success');
            
            // Recargar la lista
            await cargarConceptos();

        } catch (error) {
            mostrarMensaje('Error al eliminar el concepto', 'error');
            console.error('Error:', error);
        }
    };

    // --- Función para eliminar TODOS los conceptos ---
    async function eliminarTodosConceptos() {
        if (!confirm('¿Estás seguro de que quieres eliminar TODOS los conceptos? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            await hacerPeticion(API_BASE, {
                method: 'DELETE'
            });

            mostrarMensaje('Todos los conceptos fueron eliminados', 'success');
            
            // Mostrar lista vacía
            listaConceptos.innerHTML = `
                <div class="empty-state">
                    <h3>No hay conceptos guardados</h3>
                    <p>Utiliza el formulario de arriba para agregar tu primer concepto</p>
                </div>
            `;

        } catch (error) {
            mostrarMensaje('Error al eliminar los conceptos', 'error');
            console.error('Error:', error);
        }
    }

   // --- Event Listeners ---
    
    // Cuando se envía el formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = nombreInput.value.trim();
        const definicion = definicionInput.value.trim();

        // Validaciones básicas
        if (!nombre || !definicion) {
            mostrarMensaje('Por favor completa todos los campos', 'error');
            return;
        }

        if (nombre.length < 2) {
            mostrarMensaje('El nombre debe tener al menos 2 caracteres', 'error');
            return;
        }

        if (definicion.length < 10) {
            mostrarMensaje('La definición debe tener al menos 10 caracteres', 'error');
            return;
        }

        // Agregar concepto si todo está bien
        agregarConcepto(nombre, definicion);
    });

    // Botón para cargar conceptos
    btnCargar.addEventListener('click', cargarConceptos);

    // Botón para eliminar todos los conceptos
    btnEliminarTodos.addEventListener('click', eliminarTodosConceptos);

    // Cargar conceptos al inicializar la página
    cargarConceptos();

    // Mensaje de bienvenida
    mostrarMensaje('¡Aplicación cargada correctamente! Puedes empezar a agregar conceptos.', 'success');
});