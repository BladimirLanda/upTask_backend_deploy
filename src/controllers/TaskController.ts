//CONTROLLER TASK
import type { Request, Response } from 'express'
import colors from 'colors'
import Task from '../models/Task'

export class TaskController {
    //POST
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body);
            task.project = req.project.id; //._id

            req.project.tasks.push(task.id);

            //Método INSERT
            //Arreglo de Promesas - si todas cumplen
            await Promise.allSettled([task.save(), req.project.save()]);
            res.json({
                message: `Tarea Creada Correctamente - Proyecto: ${req.project.projectName}`,
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //GETALL
    static getAllTasks = async (req: Request, res: Response) => {
        try {
            //Método SELECT
            /*
            .populate('registro'): En Mongoose se utiliza para realizar una población de documentos 
            en campos que contienen referencias a otros documentos. Es decir, en lugar de solo obtener 
            el ID de un documento relacionado, .populate() permite que el campo se "rellene" con 
            el documento completo relacionado, basándose en una referencia.
            */
            const tasks = await Task.find({project: req.project.id}).populate('project'); //Nombre Registro
            res.json({
                tasks,
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //GETBYID
    static getByIdTask = async (req: Request, res: Response) => {
        try {
            //Método SELECT
            //*populate anidado
            const task = await Task.findById(req.task.id)
                            .populate({path: 'completedBy.user', select: 'id name email'})
                            .populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email'}});

            res.json({
                task: task,
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //PUT
    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;

            //Método UPDATE
            await req.task.save();

            res.json({
                message: `Tarea Actualizada Correctamente - Proyecto: ${req.project.projectName}`,
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //DELETE
    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id.toString() );

            //Método DELETE y UPDATE
            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

            res.json({
                message: `Tarea Eliminada Correctamente - Proyecto: ${req.project.projectName}`,
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //POST STATUS
    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            req.task.status = status;

            const data = {
                user: req.user.id,
                status: status
            }

            req.task.completedBy.push(data);

            //Método UPDATE
            await req.task.save();

            res.json({
                message: `Estatus de Tarea Actualizada - Proyecto: ${req.project.projectName}`,
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }
}