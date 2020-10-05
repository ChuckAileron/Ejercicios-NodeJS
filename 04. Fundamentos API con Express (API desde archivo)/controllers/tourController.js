//Modulos
const fs = require('fs');

//Lee los datos de entrada y los convierte a objeto JSON
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Middleware
/* Como no es buena practica repetir codigo, para chequear el id en los middleware getTour, updateTour y deleteTour
que implementaban el chequeo así:

    if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'ID invalido',
      });
    }

Es mejor agregar ese codigo en un param middleware ya que se ejecuta cuando la peticion incluye el parametro id
y se ejecuta antes de entrar a los middleware de metodos http, por lo que en caso de haber un error */

//Verifica que el ID sea valido
exports.checkID = (req, res, next, value) => {
  console.log(`Tour ID es: ${value}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'ID invalido',
    });
  }
  next();
};

//Verifica que el body del request contenga los campos 'name' y 'price'
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price)
    return res.status(400).json({
      status: 'fail',
      message: 'Falta campo -name- o -price-',
    });
  next();
};

//Route Handlers

//Entregar todos los tours (GET)
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success', //(1)
    requestedAt: req.requestTime,
    results: tours.length, //(2)
    data: {
      tours: tours, //(3)
    },
  });
};

/*
    - Es recomendable especificar la version de la api en caso de que se quieran hacer
    cambios sin romper el acceso a los que siguan usando la version 1, por ejemplo
    
    (1).- Valores para status: success, fail (error del cliente) y error (error del servidor)
    
    (2).- Se agrega la propiedad results en este caso como buen practica porque se envia un array de objetos
    
    (3)- En ES6, si la key y value tienen el mismo nombre, es posible solo dejar el value
    como en este caso se quieren entregar los tours, ademas que concuerda con el endpoint de la peticion
    dejar tours como propiedad del objeto. Si la variable tours se llamase x, entonces se dejaria como tours: x
    
    - HTTP Successful Status
        200 OK
        201 CREATED
        202 ACCEPTED
        204 NO CONTENT
    
    - HTTP ERROR
        500 INTERNAL SERVER ERROR
    */

//Entregar un tour segun id (GET)
exports.getTour = (req, res) => {
  const id = req.params.id * 1; //(1)(2)
  const tour = tours.find((element) => element.id === id); //(3)

  //Manejo de error si el parametro ingresado NO entrega un tour

  res.status(200).json({
    status: 'success',
    data: tour,
  });
};

/*
    (1).- req.params contiene todos los parametros definidos en la url (lo que va despues del ":")
    Para multiples parametros, la estructura de la ruta debe ser /api/v1/tours/:id/:param1/:param2 
    
    (2).- En JavaScript, multiplicar un string de numero por 1 o cualquier otro numero, convertira el
    resultado de la operacion en un numero
    
    (3).- find es un metodo para arrays de JavaScript que a traves de una funcion callback, itera dentro
    del array. El metodo find crea un arreglo de un solo elemento con el resultado de
    element.id === id que es verdadero
    */

//Crear un nuevo tour (POST)
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1; //Define el id del nuevo tour
  const newTour = Object.assign({ id: newId }, req.body); //Assign funciona como un "append". Agrega el parametro id al objeto
  tours.push(newTour); //Agrega el tour al arreglo tours

  //Guarda el tour creado en el archivo local
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

//Actualizar un tour (PATCH)
exports.updateTour = (req, res) => {
  //Manejo de error si el parametro ingresado NO entrega un tour

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Tour actualizado>',
    },
  });
};

//Eliminar un tour (DELETE)
exports.deleteTour = (req, res) => {
  //Manejo de error si el parametro ingresado NO entrega un tour
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};
