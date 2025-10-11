// client/src/components/UploadForm.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadMedia } from '../../api/mediaService';
import { useNavigate } from 'react-router-dom'; // Para redirecionar após o upload

export default function UploadForm() {
    const { token, isAuthenticated } = useAuth();
    // const navigate = useNavigate();
    
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Redirecionar se não estiver autenticado (opcional, mas recomendado)
    if (!isAuthenticated) {
        return <p>Por favor, faça login para enviar mídia.</p>;
        if (!isAuthenticated) navigate('/login');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!file || !title) {
            return setError('Título e arquivo são obrigatórios.');
        }

        setLoading(true);

        try {
            const newMedia = await uploadMedia(file, title, description, token);
            
            setSuccess(true);
            // Limpar formulário
            setFile(null);
            setTitle('');
            setDescription('');
            document.getElementById('file-input').value = ''; // Reset input file

            // Opcional: Recarregar o feed ou navegar para a página da nova mídia
            console.log('Mídia carregada com sucesso:', newMedia);
            
        } catch (err) {
            setError(err.message || 'Erro desconhecido ao enviar o arquivo.');
            console.error('Upload Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <h3>Enviar Nova Mídia</h3>
            <form onSubmit={handleSubmit}>
                
                {/* 1. Seleção de Arquivo */}
                <div className="form-group">
                    <label htmlFor="file-input">Arquivo (Imagem/Vídeo):</label>
                    <input
                        type="file"
                        id="file-input"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                        disabled={loading}
                    />
                </div>
                
                {/* 2. Título */}
                <div className="form-group">
                    <label htmlFor="title">Título:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                
                {/* 3. Descrição */}
                <div className="form-group">
                    <label htmlFor="description">Descrição (Opcional):</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                    />
                </div>
                
                {/* Mensagens */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>Mídia enviada com sucesso! 🎉</p>}
                
                {/* 4. Botão de Envio */}
                <button type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Mídia'}
                </button>

            </form>
        </div>
    );
}
