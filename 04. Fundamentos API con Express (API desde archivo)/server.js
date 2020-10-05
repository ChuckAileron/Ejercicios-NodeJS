// Modulos
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' }); //Especificar el path del archivo de configuracion. Lee la configuracion de variables y las guarda en las variables de entorno de NodeJS
//Se debe especificar el path antes de requerir el app.js para configurar el entorno antes de ejecutar la app

const app = require('./app'); //Importa app.js

//================================================
//  VARIABLES DE ENTORNO (ENVIRONMENT VARIABLES)
//================================================
/* NodeJS o applicaciones Express pueden ejecutarse en diferentes entornos. Los mas importantes son el entorno de desarrollo (development environment)
y el entorno de produccion (production environment). Dependiendo del entorno, se pueden usar diferentes bases de datos, activar o desactivar login,
activar o desactivar debugeo, o diferentes configuraciones que pueden cambiar dependiendo del entorno en que se trabaje.admin-nav

- Las variables de entorno son variables globales que son usadas para definir el entorno en la que la app Node esta ejecutandose

- Por defecto, Express establece el entorno como entorno de desarrollo. Las variables de entorno realmente son algo que esta fuera del alcance de Express.
Es por eso que se estan definiendo fuera del app.js
Para ver por consola la variable de entorno de Express ('env') se usa console.log(app.get('env'))

- NodeJS establece muchas variables de entorno. Para verlas por consola, se usa
console.log(process.env)

- Para crear configuraciones de las variables de entorno es posible crear un archivo de configuracion. En este caso 'config.env'

- Para leer las variables de entorno en la aplicacion, se usa un paquete llamado .env
Instalar con: npm i dotenv

npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev

*/

//Seteo del port. Si la variable de entorno existe y tiene un valor, lo usa, si no, usa 3000
const port = process.env.PORT || 3000;

//Crea el servidor y lo mantiene leyendo peticiones.
//Se puede acceder con localhost:3000 o 127.0.0.1:3000
//Se le puede dar una funcion callback que es llamada tan pronto se crea el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
