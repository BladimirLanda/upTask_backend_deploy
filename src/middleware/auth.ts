//MIDDLEWARE AUTH
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User';

/*
🔐 Autenticación	                            🛂 Autorización
Es identificar quién eres.	                    Es verificar qué permisos tienes.
Se valida que el usuario sea válido.	        Se valida si ese usuario puede acceder a algo.
Ej: iniciar sesión con correo y contraseña.	    Ej: verificar si ese usuario puede eliminar un post.
Si es correcta → se genera un token (JWT).	    Se revisa el JWT (u otros permisos) para autorizar.
Inicia sesión → recibe su token.	            Usa el token para acceder a recursos privados.

📌Autenticación → Cuando el usuario se registra o inicia sesión, 
envías correo y contraseña, y si son válidos, generas un JWT.
    ✅ Autenticado = tiene un token.

📌Autorización → Cuando ese usuario intenta, por ejemplo, acceder 
a /admin/posts, usas su JWT para verificar:
    -¿Es válido el token?
    -¿El usuario tiene permisos para esa acción?

*/
//Global Req
declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req : Request, res : Response, next : NextFunction) => {
    const bearer = req.headers.authorization;

     if(!bearer) {
        res.status(401).json({
            errors: 'No Autorizado',
            success: false
        });

        return;
    }

    const token = bearer.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        /*
        if(typeof decoded === 'object' && decoded.id) 
            1)Para asegurarte de que lo que recibiste es un objeto, 
            no un string, null, undefined o cualquier otro tipo.
                { id: "64af....", iat: 17238712 } ✅
            2)Para garantizar que ese objeto contiene la propiedad id,
            que es lo que se necesita para buscar al usuario en la base de datos.
        */
        if(typeof decoded === 'object' && decoded.id) {
            //Método GET-WHERE
            const user = await User.findById(decoded.id).select('_id name email');

            if(user) {
                req.user = user;
                next();
            } else {
                res.status(500).json({
                    errors: `Hubo un error (Token no válido)`,
                    success: false
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            errors: `Hubo un error (Token no válido): ${error.message}`,
            success: false
        });
    }
}