//MIDDLEWARE PROJECT
import type { Request, Response, NextFunction } from 'express'
import { isValidObjectId } from 'mongoose'
import Project, { IProject } from '../models/Project'

/*
Scope Global
-declare global es una manera de agregar o modificar tipos globales en TypeScript. 
Dentro de este bloque, puedes añadir o extender tipos que se utilizan en todo el proyecto, 
sin necesidad de importar ni exportar explícitamente esos tipos.
Esto se utiliza para modificar el tipo global de Express o cualquier otro tipo que 
esté disponible globalmente en el proyecto.

-namespace en TypeScript se utiliza para agrupar tipos relacionados. En este caso, 
estamos accediendo al espacio de nombres (namespace) de Express.
Al declarar dentro de namespace Express, estamos indicando que estamos extendiendo 
los tipos que pertenecen a Express, como la interfaz Request, Response, etc.

-interface Request { ... } Aquí se está extendiendo la interfaz Request de Express, 
lo que significa que estamos agregando nuevas propiedades o métodos a esta interfaz.
Por defecto, la interfaz Request de Express es usada para representar la solicitud HTTP, 
y contiene propiedades como body, query, params, etc.

-project: IProject - Esta línea agrega una nueva propiedad project a la interfaz Request, 
y el tipo de esta propiedad será IProject.
*/
declare global {
    namespace Express {
        interface Request {
            project?: IProject
        }
    }
}

export const projectExits = async (req : Request, res : Response, next : NextFunction) => {
    try {
        //Obtención de :parametros
        const { projectId } = req.params;

        if(!isValidObjectId(projectId)) {
            res.status(400).json({
                errors: 'ID no válido',
                success: false
            });

            return;
        }

        //SELECT BY ID
        const project = await Project.findById(projectId);

        if(!project) {
            res.status(404).json({
                errors: 'Proyecto no encontrado',
                success: false
            });

            return;
        }

        req.project = project;
        next();
    } catch (error) {
        res.status(500).json({
            errors: `Hubo un error: ${error.message}`,
            success: false
        });
    }
}