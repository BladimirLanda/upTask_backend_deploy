//CONTROLLER TEAM
import type { Request, Response } from 'express'
import colors from 'colors'
import User from '../models/User';
import Project from '../models/Project';

export class TeamController {

    //POST FIND MEMBER
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body;

        try {
            //Método SELECT+WHERE
            const user = await User.findOne({email}).select('id email name');

            if(!user) {
                res.status(404).json({
                    errors: 'Usuario no encontrado',
                    success: false
                });
                return;
            }

            res.json({
                user,
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //GET MEMBERS
    static getProjectMembers = async (req: Request, res: Response) => {
        //Método SELECT+WHERE
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id name email'
        });

        res.json({
            project_team: project.team,
            success: true
        });
    }

    //POST ADD MEMBER
    static addMemeberById = async (req: Request, res: Response) => {
        const { id } = req.body;

        try {
            //Método SELECT+WHERE
            const user = await User.findById(id).select('id');

            if(!user) {
                res.status(404).json({
                    errors: 'Usuario no encontrado',
                    success: false
                });
                return;
            }

            if(req.project.team.some(team => team.toString() === user.id.toString())) {
                res.status(409).json({
                    //409 'Conflicto'
                    errors: 'El usuario ya existe en el proyecto',
                    success: false
                });
                return;
            }

            //Actualización del Team - Método PUT
            req.project.team.push(user.id);
            await req.project.save();

             res.json({
                message: "Usuario agregado correctamente",
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }

    //DELETE MEMBER
    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params;

        try {
            if(!req.project.team.some(team => team.toString() === userId)) {
                res.status(409).json({
                    errors: 'El usuario no existe en el proyecto',
                    success: false
                });
                return;
            }

            req.project.team = req.project.team.filter(member => member.toString() !== userId);

            //Actualización del Team - Método PUT
            await req.project.save();

             res.json({
                message: "Miembro eliminado correctamente",
                success: true
            });
        } catch (error) {
            console.log(colors.bgRed(error.message));
        }
    }
}