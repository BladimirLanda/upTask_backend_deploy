//MIDDLEWARE VALIDACIÓN
import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const handleInputErrors = (req : Request, res : Response, next : NextFunction) => {
    //validationResult(): Extrae los errores de validación de la petición
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array(),
            success: false
        });
        return;
    }

    next();
}