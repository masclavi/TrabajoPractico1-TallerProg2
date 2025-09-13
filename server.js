// Servidor Node.js para manejo de conceptos
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Array para almacenar los conceptos
let conceptos = [];
let nextId = 1;

// Función para servir archivos estáticos
function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Archivo no encontrado');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Función para parsear el cuerpo de la petición
function parseBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (err) {
            callback(err, null);
        }
    });
}

// Crear servidor HTTP
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Configurar CORS para permitir peticiones desde el frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar preflight requests
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Servir archivos estáticos
    if (method === 'GET' && pathname === '/') {
        serveStaticFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html');
        return;
    }

    if (method === 'GET' && pathname === '/style.css') {
        serveStaticFile(res, path.join(__dirname, 'public', 'style.css'), 'text/css');
        return;
    }

    if (method === 'GET' && pathname === '/script.js') {
        serveStaticFile(res, path.join(__dirname, 'public', 'script.js'), 'application/javascript');
        return;
    }

    // API REST para conceptos
    if (pathname.startsWith('/api/conceptos')) {
        const segments = pathname.split('/');
        const conceptoId = segments[3] ? parseInt(segments[3]) : null;

        // GET: obtener todos los conceptos
        if (method === 'GET' && pathname === '/api/conceptos') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(conceptos));
            return;
        }

        // GET/id: obtener un concepto específico
        if (method === 'GET' && conceptoId) {
            const concepto = conceptos.find(c => c.id === conceptoId);
            if (concepto) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(concepto));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Concepto no encontrado' }));
            }
            return;
        }

        // POST: crear nuevo concepto
        if (method === 'POST' && pathname === '/api/conceptos') {
            parseBody(req, (err, data) => {
                if (err || !data.nombre || !data.definicion) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Datos inválidos' }));
                    return;
                }

                const nuevoConcepto = {
                    id: nextId++,
                    nombre: data.nombre,
                    definicion: data.definicion,
                    fecha: new Date().toISOString()
                };

                conceptos.push(nuevoConcepto);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(nuevoConcepto));
            });
            return;
        }

        // DELETE: eliminar todos los conceptos
        if (method === 'DELETE' && pathname === '/api/conceptos') {
            conceptos = [];
            nextId = 1;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Todos los conceptos eliminados' }));
            return;
        }

        // DELETE/id: eliminar un concepto específico
        if (method === 'DELETE' && conceptoId) {
            const index = conceptos.findIndex(c => c.id === conceptoId);
            if (index !== -1) {
                const conceptoEliminado = conceptos.splice(index, 1)[0];
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Concepto eliminado', concepto: conceptoEliminado }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Concepto no encontrado' }));
            }
            return;
        }
    }

    // 404 para rutas no encontradas
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página no encontrada');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});