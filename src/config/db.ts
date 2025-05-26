//CONFIG DB
import mongoose from "mongoose"
import colors from "colors"

export const connectDB = async () => {
    try {
        //mongoose.connect(): Es una función asíncrona que inicia la conexión con MongoDB.
        //extracción de la propiedad {connection}.
        const { connection } = await mongoose.connect(process.env.DATABASE_URL);
        const url = `${connection.host}:${connection.port}`
        console.log(colors.green.bold(`MongoDB conectado - ${url}`));
    } catch (error) {
        console.log(colors.bgRed(error.message));
        process.exit(1);
    }
}