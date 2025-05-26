//MODEL TASK
import mongoose, { Schema, Document, Types } from "mongoose"
import Note from "./Note";

//Status
/*
as const
El uso de as const en TypeScript tiene que ver con la inferencia de tipos literales. 
Al aplicar as const a un objeto, le estás indicando a TypeScript que trate las propiedades 
del objeto como valores literales, en lugar de inferir su tipo como string, number, etc.

-Las propiedades son de tipo literal: En lugar de ser de tipo genérico, las propiedades 
tienen el valor exacto 'pending', 'on_hold', etc. Este es un tipo literal de cada cadena e
specífica.

-Las propiedades son de solo lectura (readonly): Las propiedades del objeto no pueden ser 
modificadas. Es decir, no se poidra cambiar taskStatus.PENDING = 'somethingElse' porque es 
un valor constante.

Type del as const
'typeof taskStatus': 
-typeof es un operador de TypeScript que permite obtener el tipo de una variable o un objeto.
-typeof taskStatus devuelve el tipo del objeto taskStatus, que en este caso es un objeto con 
propiedades como PENDING, ON_HOLD, IN_PROGRESS, etc.

'keyof typeof taskStatus'
-keyof es un operador de TypeScript que obtiene las claves de un tipo. Si se aplica a typeof taskStatus, 
nos da las claves del objeto taskStatus (union de strings), que son:
"PENDING" | "ON_HOLD" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED"
Esto significa que 'keyof typeof taskStatus' genera un tipo que es la unión de 
las claves de taskStatus.

'typeof taskStatus[keyof typeof taskStatus]'
Ahora se está tomando el objeto 'taskStatus' y usando las claves que obtuvimos con 'keyof typeof taskStatus' 
para indexar el objeto. Se obtienen los valores del objeto taskStatus usando sus claves. En otras palabras, 
se accede a los valores que están asociados a las claves "PENDING", "ON_HOLD", etc.
Entonces, el tipo resultante será la unión de los valores de 'taskStatus', que son:
'pending' | 'on_hold' | 'inProgress' | 'underReview' | 'completed'
*/
const taskStatus = {
    PENDING: 'pending', //Pendiente
    ON_HOLD: 'on_hold', //En Espera
    IN_PROGRESS: 'inProgress', //En Progreso
    UNDER_REVIEW: 'underReview', //En revisión
    COMPLETED: 'completed' //Completado
} as const;

export type TaskStatus  = typeof taskStatus[keyof typeof taskStatus];

/*
Types: 
El objeto Types de Mongoose proporciona acceso a algunas funciones y tipos auxiliares. 
Uno de los más comunes es Types.ObjectId, que es utilizado para representar un 
identificador único de un documento en MongoDB.
Types también incluye utilidades como Types.Map, Types.Buffer, y otras que se 
utilizan para manejar tipos específicos en Mongoose.
*/
export interface ITask extends Document {
    name: string,
    description: string,
    project: Types.ObjectId,
    status: TaskStatus,
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[],
    notes: Types.ObjectId[]
}

export const TaskSchema : Schema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    },
    /*
    El campo ref en Mongoose se utiliza para establecer una referencia a otro documento 
    de una colección relacionada en la base de datos MongoDB. Esto significa que el campo 
    project en el documento actual es una referencia a un documento de la colección Project.
    */
    project: {
        type: Types.ObjectId,
        ref: 'Project'
    },
    /*
    El uso de enum en Mongoose (en este caso en el campo status) hace referencia a una 
    restricción de valores posibles para ese campo en el modelo de la base de datos.
    */
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    completedBy: [
        {
            //MongoDB le pondrá un _id a cada elemento del array 
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, {timestamps: true});

/*
Interceptores
.pre es un middleware (hook) de Mongoose que permite ejecutar una 
función antes de que se realice una operación en la base de datos.

👉 Sirve para que antes de guardar, eliminar, actualizar o incluso 
validar un documento, se puedan ejecutar tareas extra.

    'Schema.pre(operación, opciones, callback)'

    1) operación: nombre del hook, como 'save', 'deleteOne', 'findOneAndDelete', etc.
    2) opciones (opcional): objeto para especificar si se ejecuta para documentos 
    { document: true } o para queries { query: true }.
    3) callback: función que se ejecuta antes de la operación.
*/
TaskSchema.pre('deleteOne', {document: true}, async function() {
    const taskId = this._id;

    if(!taskId) return;

    await Note.deleteMany({ task: taskId });
});

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;