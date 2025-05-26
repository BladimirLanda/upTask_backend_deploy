//CONTROLLER AUTH
import type { Request, Response } from 'express'
import colors from 'colors'
import User from '../models/User'
import Token from '../models/Token'
import { AuthEmails } from '../emails/AuthEmails'
import { checkPassword, hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import { generateJWT } from '../utils/jwt'

export class AuthController {

    //POST CREATE ACCOUNT
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;

            //Email Duplicado
            //Método GET-WHERE
            const userExtis = await User.findOne({email});
            if(userExtis) {
                res.status(409).json({
                    //409: Conflicto → conflicto con la base de datos o con la lógica de negocio.
                    errors: 'Ya existe una cuenta registrada con ese email',
                    success: false
                });
                return;
            }
            
            //Instancia Modelo
            const user = new User(req.body);

            //Hash Password
            user.password = await hashPassword(password);

            //Generar Token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id; //_id

            //Email
            AuthEmails.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });

            //Método INSERT
            await Promise.allSettled([user.save(), token.save()]);
            res.json({
                message: 'Cuenta creada, revisa tu email para confirmarla',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //POST CONFIRM ACCOUNT
    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;
            
            //Método GET-WHERE
            const tokenExits = await Token.findOne({token});

            if(!tokenExits) {
                res.status(401).json({
                    //401: No Autorizado
                    errors: 'Token no válido',
                    success: false
                });
                return;
            }

            //USER
            const user = await User.findById(tokenExits.user);
            user.confirmed = true;

            //Actualización
            //PUT - DELETE
            await Promise.allSettled([user.save(), tokenExits.deleteOne()]);
            res.json({
                message: 'Cuenta confirmada correctamente',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //POST REQUEST NEW TOKEN
    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            //Usuario
            //Método GET-WHERE
            const userExits = await User.findOne({email});
            if(!userExits) {
                res.status(404).json({
                    errors: 'El usuario no está registrado',
                    success: false
                });
                return;
            }
            
            if(userExits.confirmed) {
                res.status(403).json({
                    errors: 'El usuario ya está confirmado',
                    success: false
                });
                return;
            }

            //Generar Token
            const token = new Token();
            token.token = generateToken();
            token.user = userExits.id; //_id

            //Email
            AuthEmails.sendConfirmationEmail({
                email: userExits.email,
                name: userExits.name,
                token: token.token
            });

            //Método INSERT
            await Promise.allSettled([userExits.save(), token.save()]);
            res.json({
                message: 'Se envió un nuevo token a tu e-mail',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //POST LOGIN
    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            //Método GET-WHERE
            const userExits = await User.findOne({email});

            if(!userExits) {
                res.status(404).json({
                    errors: 'Usuario no encontrado',
                    success: false
                });
                return;
            }

            if(!userExits.confirmed) {
                const token = new Token();
                token.user = userExits.id; //"663c7f7d5e093e90f21278ab" (string)
                token.token = generateToken();
                await token.save();

                //Email
                AuthEmails.sendConfirmationEmail({
                    email: userExits.email,
                    name: userExits.name,
                    token: token.token
                });

                res.status(401).json({
                    errors: 'La cuenta no ha sido confirmada, hemos enviado un nuevo token',
                    success: false
                });
                return;
            }

            //Password
            const isPasswordCorrect = await checkPassword(password, userExits.password);

            if(!isPasswordCorrect) {
                res.status(401).json({
                    errors: 'Contraseña incorrecta, vuelve a intentar',
                    success: false
                });
                return;
            }

            //JWT
            const token = generateJWT( {id: userExits.id } );

            res.json({
                message: 'Inicio de sesión exitoso',
                token,
                success: true
            });

        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //POST REQUEST NEW TOKEN
    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            //Usuario
            //Método GET-WHERE
            const userExits = await User.findOne({email});
            if(!userExits) {
                res.status(404).json({
                    errors: 'El usuario no está registrado',
                    success: false
                });
                return;
            }

            //Generar Token
            const token = new Token();
            token.token = generateToken();
            token.user = userExits.id; //_id

            //Método INSERT
            await token.save();

            //Email
            AuthEmails.sendPasswordResetToken({
                email: userExits.email,
                name: userExits.name,
                token: token.token
            });

            res.json({
                message: 'Revisa tu email para instrucciones',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //POST CONFIRM TOKEN - NEW PASSWORD
    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;
            
            //Método GET-WHERE
            const tokenExits = await Token.findOne({token});

            if(!tokenExits) {
                res.status(401).json({
                    errors: 'Token no válido',
                    success: false
                });
                return;
            }

            res.json({
                message: 'Token valido, define tu nuevo password',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //POST RESET PASSWORD
    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            
            //Método GET-WHERE
            const tokenExits = await Token.findOne({token});

            if(!tokenExits) {
                res.status(401).json({
                    errors: 'Token no válido',
                    success: false
                });
                return;
            }

            //Método GET-WHERE
            const user = await User.findById(tokenExits.user);
            user.password = await hashPassword(password);

            //Método INSERT + DELETE
            await Promise.allSettled([user.save(), tokenExits.deleteOne()]);

            res.json({
                message: 'Se actualizó la contraseña de forma correcta',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    /* USER */
    //GET USER
    static user = async (req: Request, res: Response) => {
        try {
            res.json(req.user);
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    /* PROFILE */
    //PUT PROFILE DATA
    static updateProfile = async (req: Request, res: Response) => {
        const { name, email } = req.body;

        //Método GET-WHERE
        const userExits = await User.findOne({email});

        if(userExits && userExits.id.toString() !== req.user.id) {
            res.status(409).json({
                errors: 'El email ya está registrado',
                success: false
            });
            return;
        }

        req.user.name = name;
        req.user.email = email;

        try {
            //Método INSERT
            await req.user.save();

            res.json({
                message: 'Información actualizada correctamente',
                success: true
            });            
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //POST NEW PASSWORD
    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body;

        const user = await User.findById(req.user.id);

        //Check Password
        const isPasswordCorrect = await checkPassword(current_password, user.password);

        if(!isPasswordCorrect) {
            res.status(401).json({
                errors: 'El password actual es incorrecto',
                success: false
            });
            return;
        }

        try {
            //Hash Password
            user.password = await hashPassword(password);

            //Método INSERT
            await user.save();

            res.json({
                message: 'Password actualizado correctamente',
                success: true
            });  

        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //
    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body;

        const user = await User.findById(req.user.id);

        //Check Password
        const isPasswordCorrect = await checkPassword(password, user.password);

        if(!isPasswordCorrect) {
            res.status(401).json({
                errors: 'El password es incorrecto',
                success: false
            });
            return;
        }

        try {
            res.json({
                message: 'Password correcto',
                success: true
            });
            
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }
}