//CONTROLLER NOTE
import type { Request, Response } from 'express'
import colors from 'colors'
import Note, { INote } from '../models/Note'
import { Types } from 'mongoose'

/*
Request<Params, ResBody, ReqBody, ReqQuery>
La interfaz Request de Express en TypeScript acepta genéricos para que se pueda 
tipar con precisión qué datos esperas en cada parte de la petición.

    Request<
        Params = core.ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = core.Query
    >

Parámetro	Qué significa	
Params	    Lo que viene en req.params (por ejemplo un id en /:id)	
ResBody	    Tipo que devolverías en res.send()/res.json() (normalmente se pone any o se omite)	
ReqBody	    Lo que esperas en req.body	
ReqQuery	Lo que vendría en req.query (por ejemplo un search en /tasks?search=typescript)

interface Params {
  id: string;
}

interface NotesResponse {
  notes: string[];
  total: number;
}

interface INote {
  content: string;
}

interface Query {
  search?: string;
}
*/

//Type
interface NodeParams {
    noteId: Types.ObjectId
}

export class NoteController {

    //POST
    static createNote = async (req: Request<{}, {}, INote, {}>, res: Response) => {
        //Body
        const { content } = req.body;

        //Instancia Modelo
        const note = new Note();
        note.content = content;
        note.createdBy = req.user.id;
        note.task = req.task.id;

        req.task.notes.push(note.id);

        try {
            //Método INSERT
            await Promise.allSettled([req.task.save(), note.save()]);

            res.json({
                message: 'Nota creada correctamente',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //GETALL
    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            //Método SELECT+WHERE
            const notes = await Note.find({task: req.task.id});

            res.json({
                notes,
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //DELETE
    static deleteNote = async (req: Request<NodeParams, {}, {}, {}>, res: Response) => {
        const { noteId } = req.params;

        try {
            //Método SELECT+WHERE
            const note = await Note.findById(noteId);

            if(!note) {
                res.status(404).json({
                    errors: 'Nota no encontrado',
                    success: false
                });
                return;
            }

            if(note.createdBy.toString() !== req.user.id.toString()) {
                res.status(401).json({
                    errors: 'Acción no válida',
                    success: false
                });
                return;
            }

            req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString());

            //Método DELETE + UPDATE
            await Promise.allSettled([note.deleteOne(), req.task.save()]);

            res.json({
                message: 'Nota Eliminada',
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }
}