// /config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB conectado com sucesso!${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Erro ao conectar ao DB: ${error.message}`);
        process.exit(1); // Encerra a aplicação em caso de erro
    }
};

// module.exports = connectDB;
export default connectDB;
