//CONFIG CORS
import { CorsOptions } from "cors" //npm i cors + npm i -D @types/cors

/*
CORS significa Cross-Origin Resource Sharing. Es un mecanismo de 
seguridad que implementan los navegadores para restringir o permitir 
que recursos web (como una API en Node) sean solicitados desde otro 
dominio diferente al del servidor.

CorsOptions: Respresenta la interfaz de configuración que define las 
reglas que debe seguir el middleware CORS. Entre sus propiedades:
-origin
-methods
-credentials
-optionsSuccessStatus

callback
-Si el origen está en la whitelist → callback(null, true) → permite la petición.
-Si no → callback(new Error('Error de Cors', false)) → la bloquea.
*/

/*
process.argv
En Node.js, process.argv es un array que contiene los argumentos pasados en la 
línea de comandos al ejecutar el proceso.

Ej. nodemon --exec ts-node src/index.ts --api
[
  '/ruta/ts-node',         // process.argv[0]
  '/ruta/index.ts',       // process.argv[1]
  '--api'                 // process.argv[2]
]

undefined
Cuando una petición se hace desde Postman o cURL, generalmente no envían un header Origin.
En CORS, si no hay Origin, su valor en el middleware de CORS es undefined.

Entonces:
-Si se accede al backend desde Postman, origin en la función será undefined.
-Al agregar undefined al whiteList, se permite esa petición sin problema.
*/
export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        const whiteList = [process.env.FRONTEND_URL];

        if(process.argv[2] === '--api') {
            whiteList.push(undefined);
        }

        if(!origin || whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Error de Cors'));
        }
    }
}

