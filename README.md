Gestión de Conceptos – Trabajo Práctico
---Objetivo---

Aplicar los contenidos de las primeras clases: uso de VSC, GIT y ramas, manipulación del DOM, Node.js como backend y creación de una API REST básica.

---Descripción---

La aplicación permite:

Ingresar conceptos de la materia con nombre y definición.

Guardarlos en memoria y mostrarlos en una vista dinámica.

Estilar la interfaz con CSS propio.


El backend expone la siguiente API REST en formato JSON:

GET /api/conceptos → listar todos los conceptos.

GET /api/conceptos/:id → obtener un concepto por ID.

DELETE /api/conceptos → eliminar todos los conceptos.

DELETE /api/conceptos/:id → eliminar un concepto específico.


---Criterios de aceptación---

Servidor Node.js funcional en el puerto 3000.

Formulario y listado de conceptos funcionando en el frontend.

API REST respondiendo correctamente a las operaciones pedidas.

Código comentado y organizado en un repositorio público.

Uso de al menos dos ramas y archivo .gitignore.

--------------------------------------------------
Casos de Prueba
Prueba 1: Agregar un concepto nuevo
Pasos:

Abrir la aplicación en http://localhost:3000
Completamos el formulario:

Nombre: "Node.js"
Definición: "Entorno de ejecución para JavaScript en el servidor"


Clic en "Agregar Concepto"

Resultado esperado:

Mensaje: "Concepto 'Node.js' agregado exitosamente"
El concepto aparece en la lista con ID 1
El formulario se limpia automáticamente

*Imágenes en capeta Screnshot*

Prueba 2: Ver detalles de un concepto
Pasos:

Clic en el botón "Ver Detalles" de un concepto

Resultado esperado:

Se muestra un alert con todos los detalles del concepto
Incluye: ID, nombre, definición y fecha de creación
Mensaje: "Concepto consultado"

*Imágenes en capeta Screnshot*

--------------------------------------------

Reflexión:
Durante el desarrollo de este proyecto, logré comprender la diferencia fundamental entre frontend y backend. Al principio pensaba que JavaScript solo funcionaba en navegadores, pero con Node.js aprendí que puede crear servidores completos. También entender cómo el navegador se comunica con el servidor mediante peticiones HTTP, y cómo el servidor procesa estas peticiones y responde con JSON. También me di cuenta de la importancia de separar responsabilidades: el HTML estructura, el CSS da estilo, JavaScript maneja la interacción y Node.js gestiona los datos en el servidor.