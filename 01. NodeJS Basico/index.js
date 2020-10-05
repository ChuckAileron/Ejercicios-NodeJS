//================================================
//  MODULOS
//================================================
const fs = require('fs'); //Modulo file system para lectura y escritura de archivos
const http = require('http'); //Modulo http para crear servidor y leer peticiones
const url = require('url'); //Modulo url para manejo de rutas


//================================================
//  LECTURA Y ESCRITURA DE ARCHIVOS
//================================================

//Lectura de archivo (sincrono)
//Parámetros: Path del archivo y encode de caracteres
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log('Lectura de archvo (modulo sincrono)\n');
console.log(textIn);

//Escritura de archivo (sincrono)
const textOut = `Texto nuevo y: ${textIn}.\nCreado en ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('Archivo escrito (modulo sincrono)\n');

/**************************************************
====SINCRONO====
    Cada instrucción es procesada una luego de la otra, línea por línea.
    Cada línea bloquea la ejecución de las siguientes hasta haberse terminado.
    TIP: Los codigos que se ejecuten solo una vez y al comienzo deben ser definidos como sincronos.
**************************************************/

//Lectura + Escritura (asincrono) + callback hell
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => { //callback function 1
    if (err) return console.log("ERROR AL LEER EL ARCHIVO");
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => { //callback function 2
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => { //callback function 3
            console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => { //callback function 4
                console.log("El archivo ha sido escrito")
            });
        });
    });
});
console.log('Leyendo archivo (modulo asincrono)\n');

/**************************************************
====ASINCRONO====
    Trabaja en segundo plano y, cuando haya terminado, una funcion que llame de vuelta registrada anteriormente es llamada para manejar el resultado.
    Durante todo ese tiempo, el resto del codigo continúa ejecutandose, sin ser bloqueados por la funcion anterior.
    TIP: Los codigos que se ejecutan muchas veces, como callbacks de peticion deben ser definidos como asincronos.
****************************************************/

/**************************************************
    La funcion callback para readFile siempre tendra los parametros (error, datos), donde el nombre de estos puede ser cualquiera.
    La funcion writeFile sólo tendrá el parámetro (error).
    Se recomienda usar funciones asincronicas para aplicaciones que contemplen una gran cantidad de usuarios.

====MULTIPLES CALLBACKS====
    Los callbacks interiores se ejecutaran luego de entregado el resultado del anterior.

====CALLBACK HELL====
    Muchas funciones callback una luego de la otra.
    Comunmente determinadas cuando se da una forma de triangulo dentro de la funcion principal.
    La Solucion a esto es usar promesas (promises de ES6) y await/async (ES8)
****************************************************/


//================================================
//  SERVIDOR + ROUTING + API
//================================================

// VERSION POCO EFICIENTE //

//Crea servidor. Funcion callback muestra mensaje en la pagina, en cualquier ruta
//El mensaje se muestra cada vez que haya una peticion en el servidor
/*
    const server = http.createServer((req, res) => {
    console.log(req.url);
    const pathName = req.url; //Obtiene la ruta

    //Manejo de rutas
    if (pathName === '/' || pathName === '/overview'){
        res.end('ESTE ES EL OVERVIEW :v');
    } else if (pathName === '/product') {
        res.end('ESTE ES EL PRODUCTO :v');
    } else if (pathName === '/api') {
        //Diferente manera de dar el path del archivo
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            const productData = JSON.parse(data); //Transforma el string del JSON en un objeto JavaScript
            //En este caso, un arreglo de objetos
            //Headers (codigo 200 para OK)
            res.writeHead(200, {
                'Content-type': 'application/json', //El navegador esperara una respuesta en JSON
            });
            //Respuesta. La respuesta se manda como string
            res.end(data);
        });

    } else {
        //Servidor responde con codigo de estado HTTP 404 con headers
        res.writeHead(404, {
            'Content-type': 'text-html', //El navegador esperara una respuesta en HTML
            'header-inventado': 'asd' //Nuevo header definido sin palabras reservadas 
        });
        res.end('<h1>Pagina no encontrada</h1>');
    }
});
 */

// VERSION EFICIENTE //
// Hacerlo sincronico para la lectura del JSON no da problema ya que lo que sigue se ejecuta cada vez que se hace una peticion
// Y el readFileSync se ejecutara solo una vez al montar el servidor
// Nota: No puede haber mas de 1 res.end() en la misma secuencia

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    console.log(req.url);
    const pathName = req.url; //Obtiene la ruta

    //Manejo de rutas
    if (pathName === '/' || pathName === '/overview'){
        res.end('ESTE ES EL OVERVIEW :v');
    } else if (pathName === '/product') {
        res.end('ESTE ES EL PRODUCTO :v');
    } else if (pathName === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
    } else {
        res.writeHead(404, {
            'Content-type': 'text-html'
        });
        res.end('<h1>Pagina no encontrada</h1>');
    }
});


//Servidor lee peticiones del cliente. Parametro: puerto
//Esto despliega el servidor en localhost:8000/
//server.listen(8000);

//Esto despliega el servidor en 127.0.0.1:8000/
//server.listen(8000, '127.0.0.1');

//Con funcion callback
server.listen(8000, '127.0.0.1', () => {
    console.log("Escuchando peticiones en puerto 8000");
});
