//Modulos
const express = require('express');
const tourController = require('./../controllers/tourController');

/* En el middleware (app.use), la ruta especificada funciona como ruta raiz para ese router
Por lo que para acceder a esa ruta ('/api/v1/tours') basta con dar la raiz ('/') */

//Router
const router = express.Router();

//Middlewares
router.param('id', tourController.checkID); //Chequea que el ID sea valido

/* Param middleware es un middleware que solo se ejecuta para ciertos parametros en la url
y solo es parte del middleware stack del router donde se define */

//Route Resources: Tour
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

/* Encadenar middleware en un router se hace entregandolos secuencialmente en el metodo donde se quieran utilizar */

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
