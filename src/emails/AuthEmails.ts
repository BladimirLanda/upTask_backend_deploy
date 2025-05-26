//EMAILS
import { transport } from "../config/nodemailer"

//Interface
interface IEmail {
    email: string,
    name: string,
    token: string
}

export class AuthEmails {

    //Confirmación de Cuenta
    static sendConfirmationEmail = async ( user : IEmail ) => {
        const info = await transport.sendMail({
            from: 'Uptask <admin@email.com>',
            to: user.email,
            subject: 'Uptask - Confirma tu cuenta',
            text: 'Uptask - Confirma la cuenta para continuar',
            html: `
                <p>
                Hola ${user.name}, has creado tu cuenta en Uptask, ya casi
                esta todo listo, solo debes confirmar tu cuenta
                </p>

                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar tu cuenta</a>
                <p>Ingresa el código: <b>${user.token}</b></p>
                <p>NOTA: El token expira en 10 minutos</p>
            `
        });

        console.log('Mensaje enviado', info.messageId);
    }

    //Envio de Token - Reseto de Contraseña
    static sendPasswordResetToken = async ( user : IEmail ) => {
        const info = await transport.sendMail({
            from: 'Uptask <admin@email.com>',
            to: user.email,
            subject: 'Uptask - Reestablece tu password',
            text: 'Uptask - Confirma la cuenta para continuar',
            html: `
                <p>
                Hola ${user.name}, has solicitado reestablecer tu password,
                </p>

                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>Ingresa el código: <b>${user.token}</b></p>
                <p>NOTA: El token expira en 10 minutos</p>
            `
        });

        console.log('Mensaje enviado', info.messageId);
    }
}