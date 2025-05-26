//INDEX
/*
Inicio del proyecto:
npm init --y

Dependencias:
npm i express
Express como framework web

npm i -D @types/express
Los tipos para Express 

npm i -D nodemon 
El reinicio automático del servidor 

npm i -D ts-node 
Herramienta para ejecutar TypeScript sin compilar previamente

npm i -D typescript
Compilador de TypeScript

npm i colors
Colores dentro de la consola

npm i dontenv
Cargar variables de entorno desde un archivo .env al proceso de Node.js

npm i mongoose
Mongoose es una librería de Node.js que te permite conectarte, modelar y 
trabajar con MongoDB fácilmente desde el código JavaScript o TypeScript.
Es como un ORM (Object-Relational Mapping), pero para bases de datos NoSQL 
como MongoDB (por eso se le llama ODM, Object Document Mapper).

-Te permite definir esquemas (modelos de datos) como si fueran clases.
-Facilita hacer operaciones como: crear, leer, actualizar y eliminar (CRUD).
-Valida los datos antes de guardarlos.
-Se encarga de manejar la conexión con MongoDB.

npm i express-validator
Es una librería para validar datos que llegan al backend en una aplicación hecha con Express. 
Permite verificar que, por ejemplo, un campo no esté vacío, que un correo tenga formato correcto, 
que una contraseña tenga cierto largo, etc. Valida y sanea los datos del req.body, req.params, req.query, 
etc., antes de que lleguen a tu lógica de negocio. Así evitas errores y mejoras la seguridad.
*/

import server from './server'
import colors from 'colors'

//Puerto
const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(colors.cyan.bold(`REST API funcionando en el puerto ${port}`));
});