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

