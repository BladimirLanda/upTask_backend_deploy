//MIDDLEWARE TASK
import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from '../models/Task'

//Global Req
declare global {
    namespace Express {
        interface Request {
            task?: ITask
        }
    }
}

export const taskExits = async (req : Request, res : Response, next : NextFunction) => {
    try {
        //Obtención de :parametros
        const { taskId } = req.params;

        //SELECT BY ID
        const task = await Task.findById(taskId);

        if(!task) {
            res.status(404).json({
                errors: 'Tarea no encontrada',
                success: false
            });

            return;
        }

        req.task = task;
        next();
    } catch (error) {
        res.status(500).json({
            errors: `Hubo un error: ${error.message}`,
            success: false
        });
    }
}

export const tasksBelongToProject = async (req : Request, res : Response, next : NextFunction) => {
    if(req.task.project.toString() !== req.project.id.toString()) {
        res.status(400).json({
            errors: 'Acción no valida',
            success: false
        });
        return;
    }

    next();
}

export const hasAuthorization = async (req : Request, res : Response, next : NextFunction) => {
    if(req.user.id.toString() !== req.project.manager.toString()) {
        res.status(400).json({
            errors: 'Acción no valida',
            success: false
        });
        return;
    }

    next();
}

