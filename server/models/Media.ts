import mongoose, { Schema, Document, Types } from 'mongoose';

// 1. Define a Interface para o TypeScript
// Inclui a referência ao User (owner) e ao array de Comments
export interface IMedia extends Document {
    title: string;
    description: string;
    url: string;
    type: 'image' | 'video';
    owner: Types.ObjectId; // Referência ao ID do User
    comments: Types.ObjectId[]; // Array de IDs de Comments
    createdAt: Date;
    updatedAt: Date;
}

// 2. Define o Esquema Mongoose
const MediaSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'O título da mídia é obrigatório.'],
        trim: true,
        maxlength: [100, 'O título não pode exceder 100 caracteres.']
    },
    description: {
        type: String,
        maxlength: [500, 'A descrição não pode exceder 500 caracteres.']
    },
    url: {
        type: String,
        required: [true, 'A URL do arquivo é obrigatória.'],
        unique: true // Garante que não há URLs duplicadas
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        required: [true, 'O tipo de mídia (imagem ou vídeo) é obrigatório.']
    },
    // Referência ao Modelo User
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // O nome do modelo que você referenciou em User.ts
        // required: true // 🛑 Descomentar após implementar o middleware de autenticação
    },
    // Referência ao Modelo Comment (para popular a seção de comentários)
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    // Configurações do Esquema
    timestamps: true, // Adiciona automaticamente createdAt e updatedAt
    collection: 'media'
});

// 3. Cria e Exporta o Modelo
const Media = mongoose.model<IMedia>('Media', MediaSchema);

export default Media;
