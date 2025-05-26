//CONTROLLER PROJECT
import type { Request, Response } from 'express'
import colors from 'colors'
import Project from '../models/Project'

//Clase
/*
Enfoque:
En vez de usar funciones sueltas, encapsulan todos los métodos del controlador dentro de 
una clase estática (como si fuera un módulo).
Se define un método estático, lo que significa que no se necesita instanciar 
la clase para usarlo(s).

(req: Request, res: Response): Tipado de TypeScript, importado desde express.
    -req: representa la solicitud del cliente (parámetros, body, headers...).
    -res: la respuesta que el servidor enviará al cliente.
*/
export class ProjectController {

    //POST
    static createProject = async (req: Request, res: Response) => {
        //Instancia Modelo
        const project = new Project(req.body);

        //Manager
        project.manager = req.user.id;

        try {
            //Método INSERT
            //*Project.create(req.body);
            await project.save();

            res.json({
                message: 'Proyecto Creado Correctamente',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //GETALL
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            /*
            $or
            Permite realizar consultas condicionales combinadas, o sea, busca los documentos 
            que cumplan al menos una de las condiciones que le pongas.
                '{ $or: [ { campoA: valor1 }, { campoB: valor2 } ] }'

            ➡️ Esto traerá los documentos donde:
                -campoA sea igual a valor1
                -campoB sea igual a valor2
            Se evalúan de forma independiente y si al menos una es verdadera, el documento se incluye.

            $in
            Verifica si un valor está contenido dentro de un arreglo de valores.
                '{ campo: { $in: [valor1, valor2] } }'

            ➡️ Esto traerá los documentos donde:
                -campo sea igual a valor1 o a valor2.
            También sirve cuando campo es un arreglo y se quiere verificar si contiene el valor.
            */
           //Método SELECT+WHERE
            const projects = await Project.find({
                $or: [
                    {manager: req.user.id}, // si el usuario es manager
                    {team: { $in: [req.user.id] }} // o está dentro del arreglo team
                ]
            });

            res.json({
                projects,
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //GETBYID
    static getByIdProject = async (req: Request, res: Response) => {
        //Obtención de :parametros
        const { id } = req.params;

        try {
            //Método SELECT BY ID
            const project = await Project.findById(id).populate('tasks');

            if(!project) {
                res.status(404).json({
                    errors: 'Proyecto no encontrado',
                    success: false
                });
                return;
            }

            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                res.status(401).json({
                    errors: 'Acción no válida (Obtención)',
                    success: false
                });
                return;
            }

            res.json({
                project,
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //UPDATE
    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.clientName = req.body.clientName;
            req.project.projectName = req.body.projectName;
            req.project.description = req.body.description;

            //Método INSERT
            await req.project.save();

            res.json({
                message: 'Proyecto Actualizado Correctamente',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //DELETE
    static deleteProject = async (req: Request, res: Response) => {
        try {
            //Método DELETE
            await req.project.deleteOne();
            
            res.json({
                message: 'Proyecto Eliminado Correctamente',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        } 
    }
}