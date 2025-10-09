import mongoose, { Schema, Document, Types } from 'mongoose';

// 1. Define a Interface para o TypeScript
export interface IComment extends Document {
    text: string;
    media: Types.ObjectId; // ID da mídia (foto/vídeo) comentada
    owner: Types.ObjectId; // ID do usuário que postou
    createdAt: Date;
    updatedAt: Date;
}

// 2. Define o Esquema Mongoose
const CommentSchema: Schema = new Schema({
    // Conteúdo do Comentário
    text: {
        type: String,
        required: [true, 'O comentário não pode ser vazio.'],
        trim: true,
        maxlength: [300, 'O comentário não pode exceder 300 caracteres.']
    },
    // Referência à Mídia
    media: {
        type: Schema.Types.ObjectId,
        ref: 'Media', // Nome do modelo de Mídia
        required: true
    },
    // Referência ao Dono (Usuário)
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Nome do modelo de Usuário
        required: true
    }
}, {
    // 3. Configurações do Esquema
    timestamps: true, // Adiciona automaticamente `createdAt` e `updatedAt`
    collection: 'comments'
});

// 4. Cria e Exporta o Modelo
const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
