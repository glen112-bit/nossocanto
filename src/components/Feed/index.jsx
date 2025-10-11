// client/src/components/Feed.jsx

import React, { useState, useEffect } from 'react';
import { getMediaFeed } from '../../api/mediaService.js';
import { Link } from 'react-router-dom'; // Para navegar para MediaDetails

// 🖼️ Componente Auxiliar para exibir cada item do feed
const MediaCard = ({ media }) => {
    return (
        // Link para a página de detalhes da mídia
        <Link to={`/media/${media._id}`} className="media-card-link">
            <div className="media-card">
                <div className="media-thumbnail">
                    {/* Exibe o primeiro thumbnail (se for vídeo) ou a imagem */}
                    {media.type === 'video' ? (
                        <video 
                            src={media.url} 
                            controls={false} // Não mostre controles no feed
                            muted 
                            loop 
                            style={{ maxWidth: '100%', maxHeight: '300px' }}
                        />
                    ) : (
                        <img 
                            src={media.url} 
                            alt={media.title} 
                            style={{ maxWidth: '100%', maxHeight: '300px' }} 
                        />
                    )}
                </div>
                <div className="media-info">
                    <h4>{media.title}</h4>
                    <small>Por: {media.owner.username || 'Usuário'}</small>
                    <p>Comentários: {media.commentCount || 0}</p> 
                    {/* Se o backend incluir commentCount no feed */}
                </div>
            </div>
        </Link>
    );
};

// 📢 Componente Principal do Feed
export default function Feed() {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const data = await getMediaFeed();
                setMediaList(data);
            } catch (err) {
                setError(err.message || 'Falha ao buscar o feed.');
                console.error('Feed Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    if (loading) return <div className="loading-message">Carregando Feed...</div>;
    if (error) return <div className="error-message" style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="feed-container">
            <h1>Feed de Mídias</h1>
            
            {!mediaList || mediaList.length === 0 ? (
                <p>Nenhuma mídia encontrada. Seja o primeiro a enviar!</p>
            ) : (
                <div className="media-grid">
                    {mediaList.map((media) => (
                        // O _id deve ser único e fornecido pelo MongoDB
                        <MediaCard key={media._id} media={media} />
                    ))}
                </div>
            )}
        </div>
    );
}
