/* APP.JS debe contener todo lo relacionado con las configuraciones de la app en Express. Todo lo demas debe ser repartido en diferentes archivos */

//================================================
// MODULOS
//================================================
const express = require('express'); //Guarda la funcion expressjs
const morgan = require('morgan');

const app = express(); //Guarda todos los metodos de express en app

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//================================================
// MIDDLEWARES
//================================================
/* app.use(middleware) permite usar aquel middleware. Agrega el middleware al middleware stack
- El middleware stack recibe todas las peticiones a menos que se especifique una ruta

- El ciclo request-response termina cuando el route handler entrega un res.send, res.json, res.status, etc.

- El orden en que se definen los middleware en el codigo importa a la hora de definir el middleware stack y
el ciclo request-response */

// Middleware third-party //
//De la variable agregada al entorno de NodeJS, si fue definida como desarrollo, usar el loggin
if (process.env.NODE_ENV === 'development')
  //Morgan. Loggin middleware que permite ver peticiones en la consola. El argumento entregado define como se ve el logging en consola
  app.use(morgan('dev'));

// Middleware nativos de Express //
app.use(express.json()); //Body-parser. Middleware que permite acceder al body del request
app.use(express.static(`${__dirname}/public`)); //Declara una ruta para el contenido estatico

// Middleware creados //
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //Muestra fecha y hora de la peticion. ISO String transforma a un formato mas entendible
  next();
});

//================================================
//  ROUTING
//================================================
/* Las funciones callback (ROUTE HANDLER) dentro de las especificaciones de rutas permiten definir el comprotamiento
de la petición en esa ruta. Sin embargo, se recomienda separar el callback en funciones individuales, guardar el resultado
como variable y simplemente entregar la variable como parametro al metodo correspondiente */

/* Ejemplo de uso de routing
//Metodo GET
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Holiwis', app: 'Pulenta AppWeb' });
});

Especifica el codigo de estado y envia una respuesta en application/json
El status se debe colocar antes del json. Si no se especifica, cuando la respuesta llega correctamente es un 200 OK

//Metodo POST
app.post('/', (req, res) => {
    res.send('Puedes hacer un POST en este endpoint');
});

//Metodo PATCH
Con PATCH, la app espera recibir solo un parametro del objeto para actualizar
Con PUT, la app espera recibir el objeto completo para actualizar

//Metodo DELETE
Borra un registro segun un id o identificador unico */

/*
//Manera simple de definir rutas
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

Mejor opcion: Usar .route() y encadenar los metodos que usen la misma ruta
*/
/*
//Route Resources: Tour
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//Route Resources: Users
app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
*/

/* Cuando se tienen muchas rutas, es recomendable crear routers separados para
cada recurso. En este caso, uno para tours y otro para users, con lo cual luego
es posible separarlos en archivos diferentes

Para conectar cada router con la aplicacion se debe usar como middleware.
Por ejemplo, para ('/api/v1/tours'), se usa el middleware tourRouter
*/

//Montar Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
