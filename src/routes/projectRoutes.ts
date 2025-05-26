//ROUTER PROJECT
import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { projectExits } from '../middleware/project'
import { TaskController } from '../controllers/TaskController'
import { hasAuthorization, taskExits, tasksBelongToProject } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router();

//Routes for Projects
/*
router.use(authenticate);
👉 Se está diciendo que antes de ejecutar cualquier ruta declarada 
después de esa línea, primero se ejecute el middleware authenticate.
🔒 protege todo de aquí para abajo
*/
router.use(authenticate); //Autenticación Token

router.post('/', 
    //Validación [middlewares]
    [
        body('projectName')
            .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
        body('clientName')
            .notEmpty().withMessage('El nombre del cliente es obligatorio'),
        body('description')
            .notEmpty().withMessage('El descripción del proyecto es obligatorio'),
        handleInputErrors
    ],
    //Controlador
    ProjectController.createProject
);

router.get('/', 
    ProjectController.getAllProjects);

router.get('/:id', 
    [
        param('id')
            .isMongoId().withMessage('ID no válido'),
        handleInputErrors
    ],
    ProjectController.getByIdProject
);

/*
router.param(): es una función especial de Express que te permite ejecutar middleware 
personalizado automáticamente cada vez que una ruta incluya un parámetro específico.
'si usas .param('projectId', middleware), Express ejecutará ese middleware siempre 
que una ruta tenga :projectId como parte del path en la URL'
*/
router.param('projectId', projectExits);

router.put('/:projectId', 
    [
        body('projectName')
            .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
        body('clientName')
            .notEmpty().withMessage('El nombre del cliente es obligatorio'),
        body('description')
            .notEmpty().withMessage('El descripción del proyecto es obligatorio'),
        handleInputErrors
    ],
    hasAuthorization,
    ProjectController.updateProject
);

router.delete('/:projectId',
    hasAuthorization,
    ProjectController.deleteProject
);

//Routes for Tasks
/*
Nested Resource Routing: El Nested Resource Routing (Enrutamiento de Recursos Anidados) 
es una técnica utilizada en el diseño de APIs RESTful, especialmente para representar 
relaciones jerárquicas entre recursos. Este enfoque permite estructurar las rutas de 
una API de manera que reflejen las relaciones entre los recursos, de manera anidada
o jerárquica.
En términos de enrutamiento, "anidado" significa que una ruta o recurso depende de 
otro recurso. Esto refleja una relación de "pertenencia" o "dependencia" entre ellos. 
Por ejemplo, si tienes una API para gestionar proyectos y tareas, es posible que las 
tareas estén relacionadas con un proyecto específico. En lugar de tener una ruta genérica 
para las tareas (/tasks), puedes hacer que la ruta de las tareas esté "anidada" dentro 
de un proyecto específico, algo así como /projects/{projectId}/tasks.
*/
router.param('taskId', taskExits);
router.param('taskId', tasksBelongToProject);

router.post('/:projectId/tasks',
    hasAuthorization,
    [
        body('name')
            .notEmpty().withMessage('El nombre de la tarea  es obligatorio'),
        body('description')
            .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
        handleInputErrors
    ],
    TaskController.createTask
);

router.get('/:projectId/tasks',
    TaskController.getAllTasks
);

router.get('/:projectId/tasks/:taskId',
    [
        param('taskId')
            .isMongoId().withMessage('ID no valido'),
        handleInputErrors
    ],
    TaskController.getByIdTask
);

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    [
        param('taskId')
            .isMongoId().withMessage('ID no valido'),
        body('name')
            .notEmpty().withMessage('El nombre de la tarea  es obligatorio'),
        body('description')
            .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
        handleInputErrors
    ],
    TaskController.updateTask
);

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    [
        param('taskId')
            .isMongoId().withMessage('ID no valido'),
        handleInputErrors
    ],
    TaskController.deleteTask
);

router.post('/:projectId/tasks/:taskId/status',
    [
        param('taskId')
            .isMongoId().withMessage('ID no valido'),
        body('status')
            .notEmpty().withMessage('El estado es obligatorio'),
        handleInputErrors
    ],
    TaskController.updateStatus
);

//Routes for Teams
router.post('/:projectId/team/find',
    [
        body('email')
            .isEmail().toLowerCase().withMessage('El email no es válido'),
        handleInputErrors
    ],
    TeamController.findMemberByEmail
);

router.get('/:projectId/team', 
    TeamController.getProjectMembers);

router.post('/:projectId/team',
    [
        body('id')
            .isMongoId().withMessage('El id no es válido'),
        handleInputErrors
    ],
    TeamController.addMemeberById
);

router.delete('/:projectId/team/:userId',
    [
        param('userId')
            .isMongoId().withMessage('El id no es válido'),
        handleInputErrors
    ],
    TeamController.removeMemberById
);

//Routes for Notes
router.post('/:projectId/tasks/:taskId/notes',
    [
        body('content')
            .notEmpty().withMessage('El contenido de la nota es obligatorio'),
        handleInputErrors
    ],
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
        [
        param('noteId')
            .isMongoId().withMessage('ID no valido'),
        handleInputErrors
    ],
    NoteController.deleteNote
)

export default router;

