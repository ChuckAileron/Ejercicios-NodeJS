//================================================
//  MODULOS
//================================================
const fs = require('fs'); //Modulo file system para lectura y escritura de archivos
const http = require('http'); //Modulo http para crear servidor y leer peticiones
const url = require('url'); //Modulo url para manejo de rutas
const path = require('path');

const express = require('express');
var app = express();
const slugify = require('slugify');

const replaceTemplate = require('./modules/replacesTemplate'); //Modulo con funcion replaceTemplate

//================================================
//  SERVIDOR + ROUTING + API
//================================================
//Permite acceder al contenido de la carpeta public
app.use('/static', express.static(path.join(__dirname, 'public')));

//Leer JSON
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//Arreglo de slugs con cada nombre de personaje
dataObj.map(
  (element) => (element.id = slugify(element.charName, { lower: true }))
);

/* Nota: Como los templates son estaticos, se recomienda obtenerlos fuera del callback para leerlos desde memoria */
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempChar = fs.readFileSync(
  `${__dirname}/templates/template-char.html`,
  'utf-8'
);

//Crear servidor
const server = http.createServer((req, res) => {
  //Guarda los datos de query (parametro y valor) y path. Crea 2 variables: query y pathname
  const { query, pathname } = url.parse(req.url, true);

  // MANEJO DE RUTAS //
  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' }); //Navegador espera respuesta de tipo HTML
    //Crear arreglo de tarjetas (cardsHtml) para recorrer arreglo de json de data.json
    //Map acepta un callback que toma el elemento actual y en cada iteracion
    //retorna el resultado de la operacion con el elemento actual en el arreglo
    //Join juntara todas las tarjetas HTML en un string
    const cardsHtml = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join('');
    //Reemplaza el plahceholder de tarjetas con el string generado en cardsHtml
    const output = tempOverview.replace('{%CHAR_CARDS%}', cardsHtml);
    res.end(output);
  }
  //Product page
  else if (pathname === '/char') {
    //Obtiene el personaje
    const char = dataObj.filter((item) => {
      const obj = Object.values(item);
      return obj.join('').indexOf(query.name) !== -1;
    });
    //const id = dataObj[query.id]; //Obtiene el personaje del id ingresado por url
    res.writeHead(200, { 'Content-type': 'text/html' }); //Navegador espera respuesta de tipo HTML
    const output = replaceTemplate(tempChar, char[0]);
    res.end(output);
  }
  //API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  }
  //Static content. Define contenido estatico en carpeta public para ser accedido
  else if (pathname.startsWith('/public')) {
    //Lee archivo desde con el path del request
    fs.readFile(__dirname + req.url, (err, data) => {
      //Si hay error en leer el archivo, muestra error 404
      if (err) {
        res
          .writeHead(404, { 'Content-type': 'text-html' })
          .end('<h1>Pagina no encontrada</h1>');
        return;
      }
      //Si no hay error, responde con el archivo
      res.end(data);
    });
  }
  //Not found page
  else {
    res.writeHead(404, { 'Content-type': 'text-html' });
    res.end('<h1>Pagina no encontrada</h1>');
  }
});

//Servidor lee peticiones del cliente
server.listen(8000);
