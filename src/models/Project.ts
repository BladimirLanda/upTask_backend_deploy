//MODELO PROJECT
import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose"
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";

/*
Definición del Documento:
Un Document es una instancia de un documento de MongoDB, que representa una fila de datos 
dentro de una colección. Es el objeto que Mongoose utiliza para interactuar con la base de datos, 
y se crea a partir de un Schema. Los Documents contienen métodos y propiedades de Mongoose que 
permiten realizar operaciones sobre los datos, como save(), remove(), etc.

Se define un tipo de TS que tiene los campos projectName, clientName, description,
y se extienden todos los métodos y props que vienen del Document de Mongoose 
(_id, .save(), .remove(), .createdAt, etc.)
*/

/*
PopulatedDoc: Es un tipo de dato que se usa cuando se está trabajando con documentos referenciados 
y se desea que los datos de esos documentos relacionados se "poblen" (o se resuelvan) con información 
adicional de la colección referenciada, en lugar de solo almacenar el ObjectId.

'tasks: PopulatedDoc<I & Document>[]': significa que el campo tasks será un array de documentos 
poblados (es decir, documentos con datos completos) de la colección referenciada.
'ITask & Document': representa la estructura del documento de la colección Task, y extiende a Document, 
que es la interfaz básica de Mongoose para los documentos de MongoDB.

👉 PopulatedDoc espera un tipo de documento de Mongoose como valor, por lo que por seguridad 
y compatibilidad con Mongoose, se suele hacer ITask & Document para que TypeScript esté 100% 
seguro de que es un documento válido de Mongoose, aunque ya lo hayas extendido.
*/
export interface IProject extends Document {
    projectName: string,
    clientName: string,
    description: string,
    tasks: PopulatedDoc<ITask & Document>[],
    manager: PopulatedDoc<IUser & Document>,
    team: PopulatedDoc<IUser & Document>[]
}

/*
Definición del Esquema:
Un Schema es una representación estructurada de los datos que se desean almacenar en la base 
de datos MongoDB. Define los tipos de los datos y las reglas (como la validación) que 
los documentos de una colección deben seguir.

El Schema es donde se define cómo debe lucir cada documento en la base de datos.
Es como un plano 📐 para cada objeto que guardarás en la colección.
-el tipo de dato de cada campo, 
-si es obligatorio (required),
-si quieres limpiar espacios (trim),
-si quieres índices, validaciones, etc.
*/
const ProjectSchema: Schema = new Schema({
    //Tipos MongoDB: https://mongoosejs.com/docs/schematypes.html
    projectName: {
        type: String,
        required: true,
        trim: true,
    },
    clientName: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task' //Nombre Módelo
        }
    ],
    manager: {
            type: Types.ObjectId,
            ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
}, {timestamps: true});

//Interceptores
ProjectSchema.pre('deleteOne', {document: true}, async function() {
    const projectId = this._id;

    if(!projectId) return;

    const tasks = await Task.find({ project: projectId });
    for(const task of tasks) {
        await Note.deleteMany({ task: task.id });
    }

    await Task.deleteMany({ project: projectId });
});

/*
Definición del Módelo:
Aquí se está creando el modelo de Mongoose basado en el ProjectSchema.
Este modelo es el que se usa para interactuar con la base de datos: crear, 
buscar, actualizar, etc.

El <ProjectType> le indica a TypeScript cuál será el tipo de datos 
que tendrá cada documento que se obtenga de este modelo.

"Este modelo se llama Project, se basa en el schema 'ProjectSchema', y todos sus 
documentos seguirán el tipo 'IProject'."
*/
const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;