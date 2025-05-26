//ROUTER AUTH
import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth';

const router = Router();

/*
.custom()
Este método permite definir una validación personalizada.
Recibe una función de callback donde se puede acceder:
    -value → el valor actual del campo (password-confirmation en este caso)
    -un objeto de opciones (meta) → { req } para acceder a la petición completa (req.body, req.params, etc.)
En este caso:
Compara el valor de password-confirmation con password.
    -Si son diferentes, lanza un error que queda registrado en la validación.
    -Si pasan, retorna true y la validación continúa.
*/
//Routes for Auth
router.post('/create-count', 
    [
        body('name')
            .notEmpty().withMessage('El nombre no puede ir vacio'),
        body('password')
            .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
        body('password_confirmation')
            .custom((value, { req }) => {
                if(value !== req.body.password) {
                    throw new Error('Los password no son iguales');
                }
                return true;
            }),
        body('email')
            .isEmail().withMessage('El email no es válido'),  
        handleInputErrors
    ],
    AuthController.createAccount
);

router.post('/confirm-account',
    [
        body('token')
            .notEmpty().withMessage('El token no puede ir vacio'),
        handleInputErrors
    ],
    AuthController.confirmAccount
);

router.post('/login', 
    [
        body('email')
            .isEmail().withMessage('El email no es válido'),
        body('password')
            .notEmpty().withMessage('El password no puede ir vacio'),  
        handleInputErrors
    ],
    AuthController.login
)

router.post('/request-code', 
    [
        body('email')
            .isEmail().withMessage('El email no es válido'), 
        handleInputErrors
    ],
    AuthController.requestConfirmationCode
);

router.post('/forgot-password', 
    [
        body('email')
            .isEmail().withMessage('El email no es válido'), 
        handleInputErrors
    ],
    AuthController.forgotPassword
);

router.post('/validate-token', 
    [
        body('token')
            .notEmpty().withMessage('El token no puede ir vacio'),
        handleInputErrors
    ],
    AuthController.validateToken
);

router.post('/update-password/:token', 
    [
        param('token')
            .isNumeric().withMessage('Token no valido'),
        body('password')
            .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
        body('password_confirmation')
            .custom((value, { req }) => {
                if(value !== req.body.password) {
                    throw new Error('Los password no son iguales');
                }
                return true;
            }),
        handleInputErrors
    ],
    AuthController.updatePasswordWithToken
);

/* USER */
router.get('/user',
    authenticate,
    AuthController.user
);

/* PROFILE */
router.put('/profile',
    authenticate,
    [
        body('name')
            .notEmpty().withMessage('El nombre no puede ir vacio'),
        body('email')
            .isEmail().withMessage('El email no es válido'),
        handleInputErrors
    ],
    AuthController.updateProfile
);

router.post('/update-password',
    authenticate,
    [
        body('current_password')
            .notEmpty().withMessage('El password actual no puede ir vacío'),
        body('password')
            .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
        body('password_confirmation')
            .custom((value, { req }) => {
                if(value !== req.body.password) {
                    throw new Error('Los password no son iguales');
                }
                return true;
            }), 
        handleInputErrors
    ],
    AuthController.updateCurrentUserPassword
);

router.post('/check-password', 
    authenticate,
    [
        body('password')
            .notEmpty().withMessage('El password no puede ir vacío'),
        handleInputErrors
    ],
    AuthController.checkPassword
)

export default router;