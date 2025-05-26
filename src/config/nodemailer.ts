//NODEMAILER -> MAILTRAP(dev)
import nodemailer from 'nodemailer' //npm i nodemailer + npm i -D @types/nodemailer
import dotenv from 'dotenv'

/*
nodemailer
Es una librería de Node.js para enviar correos electrónicos desde una aplicación backend.
Soporta SMTP (Simple Mail Transfer Protocol), servicios como Gmail, Mailgun, Amazon SES, 
y para entornos de desarrollo Mailtrap, que simula recibir emails sin enviarlos realmente.

Mailtrap
Es un servicio para pruebas de email en desarrollo.
No envía los correos al destinatario real, sino que los guarda en una bandeja virtual 
para verlos desde su panel web.
Ideal para no andar enviando mails reales mientras desarrollas.
*/

//Variables de Entorno
dotenv.config();

//Configuración SMTP para conectarte al servidor de correo (en este caso Mailtrap).
const config = () => {
    return {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }
}

//Crea y exporta una instancia de transporte configurada con esos datos.
export const transport = nodemailer.createTransport(config());

