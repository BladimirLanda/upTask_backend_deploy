//SERVER
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan' //npm i morgan + npm i -D @types/morgan
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'
import projectRoutes from './routes/projectRoutes'
import authRoutes from './routes/authRoutes'

//Variables de entonro
dotenv.config();

//Conexión DB
connectDB();

//Servidor Express
const app = express();

//Cors
app.use(cors(corsConfig));

//Logging 
/*
Morgan es un middleware para Express.js que sirve como logger de peticiones HTTP en el servidor.
Cada vez que llega una petición al servidor, Morgan registra información sobre esa petición 
en la consola o en un archivo (dependiendo de cómo se configure).
-Se está usando Morgan como middleware global (por eso el app.use)
-Se está usando el formato 'dev' para los logs (GET /api/projects 200 12.345 ms - 150).
    -304 Not Modified: "El recurso no ha cambiado desde la última vez que el cliente (navegador o app) lo solicitó"
    Cuando un cliente hace una solicitud a un servidor (GET normalmente), puede enviar cabeceras 
    de validación de caché como:
    1) If-Modified-Since
    2) If-None-Match (ETag)
    Si el servidor detecta que el recurso no ha sido modificado desde esa fecha o no ha cambiado su ETag, 
    responde con:
        HTTP/1.1 304 Not Modified
    Y no envía el cuerpo de la respuesta (el JSON, HTML o archivo). El cliente reutiliza lo que tiene en caché.
*/
app.use(morgan('dev'));

//Servidor JSON
app.use(express.json());


//Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

export default app;