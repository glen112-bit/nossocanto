// client/src/components/Profile.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getUserMedia } from '../../api/mediaService.js';
import { Link, Navigate } from 'react-router-dom'; // Para redirecionar e linkar

// Componente auxiliar (simplificado, você pode reutilizar o MediaCard do Feed)
const UserMediaCard = ({ media }) => (
    <Link to={`/media/${media._id}`} className="media-card-link">
        <div className="user-media-card" style={{ border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
            {media.type === 'image' ? (
                <img src={media.url} alt={media.title} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            ) : (
                <p>[Vídeo] {media.title}</p>
            )}
            <h4>{media.title}</h4>
        </div>
    </Link>
);


export default function Profile() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    const [mediaList, setMediaList] = useState([]);
    const [loadingMedia, setLoadingMedia] = useState(true);
    const [error, setError] = useState(null);

    // 🛑 Redireciona se o usuário não estiver logado
    if (!authLoading && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Efeito para carregar as mídias do usuário
    useEffect(() => {
        if (!user) return; // Não faz nada se o usuário ainda estiver carregando ou for nulo

        const fetchUserPosts = async () => {
            setLoadingMedia(true);
            try {
                // O ID do usuário logado é obtido do objeto 'user' no AuthContext
                const data = await getUserMedia(user._id); 
                setMediaList(data);
            } catch (err) {
                setError(err.message || 'Falha ao carregar suas mídias.');
                console.error('Profile Media Fetch Error:', err);
            } finally {
                setLoadingMedia(false);
            }
        };

        fetchUserPosts();
    }, [user]); // Re-executa sempre que o objeto 'user' for carregado/atualizado

    // Exibe tela de carregamento principal
    if (authLoading) return <div>Carregando perfil...</div>;

    return (
        <div className="profile-container">
            {/* --- Informações do Perfil --- */}
            <header className="profile-header">
                <h2>Perfil de {user.username}</h2>
                <p>Email: {user.email}</p>
                <button 
                    // 🛑 FUTURA FUNCIONALIDADE: Abre um modal para editar o perfil
                    onClick={() => alert('Funcionalidade de edição de perfil ainda não implementada!')}
                    style={{ padding: '10px', marginTop: '10px' }}
                >
                    Editar Perfil
                </button>
            </header>

            {/* --- Mídias Postadas pelo Usuário --- */}
            <section className="user-posts">
                <h3>Minhas Postagens</h3>
                
                {loadingMedia ? (
                    <p>Carregando suas mídias...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : mediaList.length === 0 ? (
                    <p>Você ainda não postou nenhuma mídia. Que tal <Link to="/upload">enviar uma agora</Link>?</p>
                ) : (
                    <div className="media-grid">
                        {mediaList.map((media) => (
                            <UserMediaCard key={media._id} media={media} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
