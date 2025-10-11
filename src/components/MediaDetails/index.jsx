// client/src/components/MediaDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 🛑 Necessário para rotas
import { useAuth } from '../../context/AuthContext.jsx';
import { getMediaDetails, postComment, getMediaComments } from '../../api/mediaService.js';

// Componente auxiliar simples para renderizar cada comentário
const CommentItem = ({ comment }) => (
    <div className="comment-item" style={{ borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
        <p>
            <strong>{comment.owner.username || 'Usuário Desconhecido'}</strong>: {comment.text}
        </p>
        <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
    </div>
);

export default function MediaDetails() {
    const { mediaId } = useParams(); // Obtém o ID da mídia da URL (ex: /media/123)
    const { isAuthenticated, token, user } = useAuth();

    const [media, setMedia] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // --- Funções de Carregamento ---
    
    // 1. Carrega a mídia e os comentários iniciais
    useEffect(() => {
        const fetchData = async () => {
            if (!mediaId) {
                setError('ID da mídia não fornecido.');
                setLoading(false);
                return;
            }

            try {
                // Busca a mídia
                const mediaData = await getMediaDetails(mediaId);
                setMedia(mediaData);

                // Busca os comentários
                const commentsData = await getMediaComments(mediaId);
                setComments(commentsData || []);
                
            } catch (err) {
                setError(err.message || 'Erro ao carregar detalhes da mídia.');
                console.error('Fetch Details Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mediaId]);


    // --- Lógica de Comentário ---

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        if (!isAuthenticated || !token) {
            setError('Você precisa estar logado para comentar.');
            return;
        }

        try {
            // Envia o comentário para o backend
            const newComment = await postComment(mediaId, commentText, token);
            
            // Adiciona o comentário recém-criado à lista localmente
            // 🛑 O backend retorna o campo 'owner' populado (username/profileImageUrl)
            setComments(prev => [newComment, ...prev]); 
            setCommentText('');

        } catch (err) {
            setError(err.message || 'Falha ao enviar comentário.');
            console.error('Comment Submit Error:', err);
        }
    };

    // --- Renderização ---

    if (loading) return <div className="loading-message">Carregando detalhes da mídia...</div>;
    if (error) return <div className="error-message" style={{ color: 'red' }}>{error}</div>;
    if (!media) return <div className="not-found">Mídia não encontrada.</div>;

    // Renderização principal
    return (
        <div className="media-details-page">
            <header>
                <h2>{media.title}</h2>
                <small>Postado por: {media.owner.username}</small>
            </header>
            
            <div className="media-content">
                {/* Renderiza Mídia (assumindo que media.url é o caminho do servidor) */}
                {media.type === 'image' ? (
                    <img src={media.url} alt={media.title} style={{ maxWidth: '100%' }} />
                ) : (
                    <video controls src={media.url} style={{ maxWidth: '100%' }} />
                )}
                
                <p>{media.description}</p>
            </div>

            {/* --- Seção de Comentários --- */}
            <section className="comments-section">
                <h3>Comentários ({comments.length})</h3>
                
                {/* Formulário de Comentário */}
                {isAuthenticated ? (
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Adicione um comentário..."
                            rows="3"
                            required
                        />
                        <button type="submit">Comentar</button>
                    </form>
                ) : (
                    <p>Faça login para adicionar um comentário.</p>
                )}

                {/* Lista de Comentários */}
                <div className="comments-list">
                    {/* Renderiza do mais novo para o mais antigo, se a API for assim */}
                    {comments.map((comment) => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))}
                    {!comments.length && <p>Nenhum comentário ainda. Seja o primeiro!</p>}
                </div>
            </section>
        </div>
    );
}
