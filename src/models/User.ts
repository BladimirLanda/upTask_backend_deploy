//MODELO USER (AUTH)
import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
    email: string,
    password: string,
    name: string,
    confirmed: boolean
}

const userSchema : Schema = new Schema({
    // Mongoose agrega _id (como ObjectId) automáticamente a todos los documentos.
    // También crea una propiedad virtual id (como string) que equivale a _id.toString()
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;