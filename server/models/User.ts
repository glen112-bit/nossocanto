// Exemplo de como deve ser o seu modelo User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // Campo crítico para o Passport rastrear usuários do Google
    googleId: { 
        type: String, 
        unique: true,
        sparse: true // Permite que documentos sem este campo sejam criados (para login manual)
    },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 6 }, // Opcional, se você também permitir login manual
    userImagePath: { type: String, default: null },
    }, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

