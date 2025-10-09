// server/models/User.ts

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Se necessário para o middleware 'pre-save'

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    // ... outros campos
});

// Middleware para hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


// 🛑 Garanta que a exportação está no formato ESM
const User = mongoose.model('User', UserSchema);
export default User;
