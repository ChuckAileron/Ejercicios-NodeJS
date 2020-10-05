//Modulos
const fs = require("fs");
const superagent = require("superagent");

//================================================
// CALLBACK HELL
//================================================
/*
fs.readFile(`${__dirname}/cat.txt`, (err, data) => { //(1)
  console.log(`Breed: ${data}`);
  superagent
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${data}`) //(2)
    .end((err, res) => { //(3)
      if (err) return console.log(err);
      console.log(res.body[0].url); //Retorna un arreglo de 1 elemento, por eso se agrega [0] para acceder al elemento
      fs.writeFile("cat-img.txt", res.body[0].url, (err) => { //(4)
        if (err) return console.log(err);
        console.log("Michi random guardado en archivo");
      });
    });
});

(1).- Obtiene la raza desde archivo
(2).- Envia peticion
(3).- Obtiene respuesta
(4).- Guarda imagen

Callback Hell se llama cuando hay varios callback dentro de otro callback. Se reconocen por tener una identacion de forma triangular */

/* Una promesa es un tipo de dato que es creado inmediatamente y que al comienzo no tiene ningun valor asignado porque el servidor esta obteniendo la data asincronicamente.
Sirven para "prometer" a la funcion que tendra una respuesta en el futuro, sea buena o mala

Al crearse, la promesa es una "promesa pendiente" (pending promise), y al tener una respuesta es una "promesa resuelta". que pudo haber tenido exito en obtener la respuesta esperada
o haber fracasado, obteniendo un mensaje de error. */

//================================================
// CONSUMIR PROMESAS
//================================================
/*
//El metodo get de superagent crea automaticamente una promesa)
fs.readFile(`${__dirname}/cat.txt`, (err, data) => {
  console.log(`Breed: ${data}`);
  superagent
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${data}`)
    .then((res) => {
      //(1)
      console.log(res.body[0].url); //Retorna un arreglo de 1 elemento, por eso se agrega [0] para acceder al elemento
      fs.writeFile("cat-img.txt", res.body[0].url, (err) => {
        console.log("Michi random guardado en archivo");
      });
    })
    .catch((err) => console.log(err.message)); //(2)
});

(1).- El metodo .then() permite "consumir" la promesa y realizar alguna operacion con ella
Este metodo solo trabaja con promesas que hayan tenido exito en obtener la respuesta

(2).- El metodo .catch() permite "consumir" el error de la promesa
*/

//================================================
// CONSTRUIR UNA PROMESA
//================================================
/*
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    //(1)
    fs.readFile(file, (err, data) => {
      if (err) reject(`No pude encontrar el archivo :'c`); //(2)
      resolve(data); //(3)
    });
  });
};

(1).- return new Promise() es el constructor de promesas incluido en ES6
readFilePromise leera el archivo asincronicamente, retornando una promesa. Cuando readFile termine su ejecucion, entregara el valor a la promesa

Los parametros entregados en el constructor de la promesa, resolve y reject son funciones que manejan los estados de la promesa.

(2).- Llamar a la funcion reject, maracara a la promesa como fallida. El parametro entregado en reject() sera la respuesta resultante de la promesa que estara disponible para el metodo .catch()

(3).- Llamar a la funcion resolve, maracara a la promesa como exitosa. El parametro entregado en result() sera el valor resultante de la promesa que estara disponible para el metodo .then()


//Consumir promesa de readFilePromise
readFilePromise(`${__dirname}/cat.txt`).then((data) => {
  console.log(`Breed: ${data}`);
  superagent
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${data}`)
    .then((res) => {
      console.log(res.body[0].url);
      fs.writeFile("cat-img.txt", res.body[0].url, (err) => {
        console.log("Michi random guardado en archivo");
      });
    })
    .catch((err) => console.log(err.message));
});

Esto sigue teniendo una estructura de Callback Hell.
La manera de solucionarlo es encadenando los handlers de las promesas (then) de manera que cada handler retorne una nueva promesa
*/

//================================================
// CONSTRUIR UNA PROMESA Y ENCADENAR HANDLERS
//================================================
//Promesa Leer Archivo
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(`No pude encontrar el archivo :'c`);
      resolve(data);
    });
  });
};
//Promesa Escribir Archivo
const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(`No pude escribir el archivo :'c`);
      resolve("success");
    });
  });
};

/*
//Encadenar handlers
readFilePromise(`${__dirname}/cat.txt`)
  .then((data) => {
    console.log(`Buscando foto del michi: ${data} :D`);
    return superagent.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${data}`
    );
  })
  .then((res) => {
    console.log(res.body[0].url);
    return writeFilePromise("cat-img.txt", res.body[0].url);
  })
  .then(() => {
    console.log("Michi random guardado en archivo");
  })
  .catch((err) => {
    console.log(err.message);
  });


Esta manera, hace mas entendible la lectura del codigo, sin embargo, hay una mejor manera y mas recomendable de trabajar con promesas y consumirlas y es usando async/await
*/

//================================================
// CONSUMIR PROMESAS CON ASYNC/AWAIT
//================================================
/*
//Crear funcion async
const getCatPic = async () => {
  try {
    //Espera a que se tenga el valor de la raza del archivo
    const data = await readFilePromise(`${__dirname}/cat.txt`);
    console.log(`Buscando foto del michi: ${data} :D`);
    //Espera a que la peticion devuelva un resultado
    const res = await superagent.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${data}`
    );
    console.log(res.body[0].url);
    //Espera a guardar el resultado en archivo
    await writeFilePromise("cat-img.txt", res.body[0].url);
    console.log("Michi random guardado en archivo");
  } catch (err) {
    console.log(err.message);
  }
  return '2: Async terminado';
};
console.log("1: Obtendre una foto de un michi");
const x = getCatPic(); //Llamada a la funcion async para ser ejecutada
console.log(x);
console.log("3: Ya consegui la foto del michi");


- La funcion async retorna automaticamente una promesa y se ejecuta como funcion asincronica

- En una funcion async siempre es posible tener una o mas expresiones await. Await solo se puede usar dentro de una funcion async

- La expresion await siempre es: await + promesa. Por ejemplo await readFilePromise

- Await parara el codigo hasta que la promesa este resuelta y es posible guardar esta resolucion en una variable
de esta manera, la funcion async se ve como si fuera sincronica, pero en realidad trabaja asincronicamente

- En funciones async, no es posible usar los metodos .then() y .catch() de las promesas, por lo que el manejo de errores se debe hacer de otra forma.

- Para realizar un manejo de errores en funciones async es posible utilizar las expresiones try y catch

//Flujo de Mensajes: resultado
1: Obtendre una foto de un michi
Promise { <pending> }
3: Ya consegui la foto del michi
2: Async terminado

- Al ejecutar la aplicacion, se ejecuta el primer mensaje, luego la llamada a la funcion async, la cual muestra un Promise { <pending> }, esto porque la promesa
es creada inmediatamente y aun no tiene un valor, por lo que sigue ejecutandose asincronicamente, sin bloquear el codigo, por lo que pasa a la siguiente instruccion
que muestra el mensaje 3. Una vez resuelta la promesa del async, el mensaje 2 retornado por ella, pero no hay instrucciones que la muestren. Para mostrarla, es posible
usar await o un metodo then() ya que la funcion async retorna una promesa
*/

/*
console.log("1: Obtendre una foto de un michi");
getCatPic().then((x) => {
  console.log(x);
  console.log("3: Ya consegui la foto del michi");
});

//Flujo de Mensajes: resultado
1: Obtendre una foto de un michi
2: Async terminado
3: Ya consegui la foto del michi

- Como la funcion async retorna una promesa, la llamada a ella puede ser encadenada a un metodo then() para definir un comportamiento al momento de recibir la promesa
por lo que, luego del primer mensaje, el codigo espera a que la promesa se cumpla

- En caso de haber un error, se seguira obteniendo el mensaje 2 ya que el return esta puesto de forma que siempre se llegue a el tanto luego de try o catch
De modo de entregar el error, hay que usar un metodo llamado throw() dentro del catch que contenga el error
*/
/*
//Crear funcion async
const getCatPic = async () => {
  try {
    //Espera a que se tenga el valor de la raza del archivo
    const data = await readFilePromise(`${__dirname}/cat.txt`);
    console.log(`Buscando foto del michi: ${data} :D`);
    //Espera a que la peticion devuelva un resultado
    const res = await superagent.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${data}`
    );
    console.log(res.body[0].url);
    //Espera a guardar el resultado en archivo
    await writeFilePromise("cat-img.txt", res.body[0].url);
    console.log("Michi random guardado en archivo");
  } catch (err) {
    console.log(err.message);
    throw err;
  }
  return "2: Async terminado";
};
console.log("1: Obtendre una foto de un michi");
getCatPic()
  .then((x) => {
    console.log(x);
    console.log("3: Ya consegui la foto del michi");
  })
  .catch((err) => {
    console.log(`ERROR :'v`);
  });
*/

/*
De este modo, de existir un error en la funcion async, sera atrapado por el catch atado a la llamada a la funcion async.
El problema de usar esta estructura de async y promesa async con then y catch, es que se pierde la estructura deseada de async/await
Una forma de arreglar esto es usando la expresion IIFE IIFE (Inmediately-Invoked Function Expressions)
*/

/*
//Funcion IIFE (funcion inmediatamente invocada). De comportamiento async en este caso
(async () => {
  try {
    console.log("1: Obtendre una foto de un michi");
    const x = await getCatPic();
    console.log(x);
    console.log("3: Ya consegui la foto del michi");
  } catch (err) {
    console.log(`ERROR :'v`);
  }
})();
*/

/*
El ultimo parentesis "();" es lo que hace que se ejecute inmediatamente
*/
/*
console.log("1: Obtendre una foto de un michi");
getCatPic()
  .then((x) => {
    console.log(x);
    console.log("3: Ya consegui la foto del michi");
  })
  .catch((err) => {
    console.log(`ERROR :'v`);
  });
*/
//================================================
// EJECUTAR VARIAS PROMESAS A LA VEZ
//================================================

const getCatPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/cat.txt`);
    console.log(`Buscando foto del michi: ${data} :D`);

    const res1Promise = superagent.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${data}`
    );
    const res2Promise = superagent.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${data}`
    );
    const res3Promise = superagent.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${data}`
    );
    const res4Promise = superagent.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${data}`
    );
    const res5Promise = superagent.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${data}`
    );
    const res6Promise = superagent.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${data}`
    );

    const all = await Promise.all([
      res1Promise,
      res2Promise,
      res3Promise,
      res4Promise,
      res5Promise,
      res6Promise,
    ]);
    const imgs = all.map((el) => el.body[0].url); //Separa las url y construye un array de url de imagenes
    console.log(imgs);

    await writeFilePromise(`cat-img.txt`, imgs.join(`\n`)); //Guarda en archivo todas las url unidas
    console.log("Michi random guardado en archivo");
  } catch (err) {
    console.log(err.message);
    throw err;
  }
  return "2: Async terminado";
};
getCatPic();

/*
Para conseguir mas fotos de michis en una sola ejecucion, es necesario guardar cada una de las promesas en su propia variable
OJO: guardar las promesas, no sus valores resueltos.

Promise.all() recibe un array de promesas y las procesa una tras otra. El resultado es otro array con las resoluciones 

*/
