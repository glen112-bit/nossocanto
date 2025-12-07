import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Hash, Image, Edit } from 'lucide-react'; // Adicionado Edit para o botão de edição
import './style.css' // Dependência de estilos externos

// --- URL base do backend para uploads ---
const BACKEND_URL = 'http://localhost:3000';

/**
 * Função auxiliar para obter a URL correta da imagem de perfil.
 * @param {string | null} path - Caminho da imagem (local ou URL de terceiros).
 * @param {object} user - Objeto do usuário para gerar iniciais em caso de fallback.
 * @returns {string} URL final da imagem.
 */
const getProfilePictureUrl = (path, user) => {
    const tempUser = user || { name: 'User' };
    
    // 1. URL Absoluta (Google, etc.)
    if (typeof path === 'string' && path.startsWith('http')) {
        return path;
    }
    
    // 2. Caminho de upload local
    if (typeof path === 'string' && path.trim() !== '') {
        let normalizedPath = path.replace(/\\/g, '/');
        const uploadIndex = normalizedPath.toLowerCase().indexOf('uploads/');
        
        if (uploadIndex !== -1) {
            normalizedPath = normalizedPath.substring(uploadIndex);
            // Adiciona um timestamp para forçar o recarregamento em caso de atualização
            return `${BACKEND_URL}/${normalizedPath}?t=${new Date().getTime()}`;
        }
        // Se a string não é uma URL http e não contém 'uploads/', é um caminho inválido ou relativo.
        console.warn("Caminho de imagem local inválido. Usando fallback de avatar.");
    }
    
    // 3. Fallback: Avatar gerado por iniciais
    const nameToUse = tempUser?.name || tempUser?.username || tempUser?.email?.split('@')[0];
    const initials = nameToUse ? nameToUse.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    return `https://ui-avatars.com/api/?name=${initials}&background=1D4ED8&color=FFFFFF&size=128&bold=true`;
};


// -------------------------------------------------------------
// ✅ COMPONENTE: USERPOSTSSECTION
// -------------------------------------------------------------
const UserPostsSection = ({ userId, name }) => {
    const mockPosts = [
        { id: 1, text: "Grande experiência neste feriado! Adorei a piscina. #viagem #verao", image: "https://via.placeholder.com/600x400?text=Foto+Viagem+1" },
        { id: 2, text: "As regras estão claras, pessoal! Mantenham a organização.", image: null },
    ];

    const [posts, setPosts] = useState(mockPosts);
    const [newPostText, setNewPostText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleNewPost = (e) => {
        e.preventDefault();
        if (newPostText.trim() === '' && !selectedImage) return;
        
        // Simulação de postagem (Mantenha o FormData para testar a estrutura)
        setIsPosting(true);
        
        const formData = new FormData();
        formData.append('text', newPostText);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        setTimeout(() => {
            const newPost = {
                id: Date.now(),
                text: newPostText,
                // Usa URL.createObjectURL para mostrar a imagem localmente antes do upload real
                image: selectedImage ? URL.createObjectURL(selectedImage) : null, 
            };
            setPosts([newPost, ...posts]);
            setNewPostText('');
            setSelectedImage(null);
            setIsPosting(false);
        }, 800);
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };
    
    return(
        <div className="posts-section mt-8">
            <h2 className="details-title flex items-center mb-4 border-b pb-2">
                <Mail className="w-5 h-5 mr-2 text-green-500" /> Minhas Experiências
            </h2>

            {/* Formulário de Nova Postagem (Create Post) */}
            <form onSubmit={handleNewPost} className="new-post-form mb-6 p-4 bg-gray-100 rounded-lg shadow-inner">
                <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    /* placeholder={`O que você gostaria de compartilhar, ${name}?`} // CORRIGIDO: Comentário em JSX */
                    placeholder={`O que você gostaria de compartilhar, ${name}?`}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="3"
                    disabled={isPosting}
                />
                {selectedImage && (
                    <p className="text-sm text-green-600 my-2 flex items-center">
                        <Image className="w-4 h-4 mr-1"/> Imagem selecionada: {selectedImage.name}
                    </p>
                )}
                <div className="flex justify-between items-center mt-3">
                    {/* Input e Label para upload de imagem */}
                    <input 
                        type="file" 
                        id="image-upload" 
                        className="hidden" 
                        accept="image/*" 
                        disabled={isPosting} 
                        onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload" className="px-3 py-1 text-sm bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition">
                        Adicionar Foto/Vídeo
                    </label>

                    <button
                        type="submit"
                        disabled={isPosting || (newPostText.trim() === '' && !selectedImage)}
                        className={`px-4 py-2 text-white font-semibold rounded-full transition ${
                            isPosting || (newPostText.trim() === '' && !selectedImage) 
                                ? 'bg-indigo-300 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {isPosting ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </form>

            {/* Feed de Postagens */}
            <div className="posts-feed space-y-4">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post.id} className="post-item p-4 border rounded-lg shadow-sm bg-white">
                            <p className="text-gray-800 mb-2">{post.text}</p>
                            {post.image && (
                                <img src={post.image} alt="Conteúdo da Postagem" className="w-full rounded-lg mt-2 object-cover" />
                            )}
                            <small className="text-gray-500 block mt-2">Postado agora</small>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">Nenhuma postagem ainda. Compartilhe sua primeira experiência!</p>
                )}
            </div>
        </div>
    );
};

// -------------------------------------------------------------
// ✅ COMPONENTE PRINCIPAL: PROFILEPAGE
// -------------------------------------------------------------
function ProfilePage() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const handleLogout = () => {
        setIsLoading(true);
        setTimeout(() => {
            logout();
            setIsLoading(false);
            navigate('/login');
        }, 500); 
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center p-12 bg-white rounded-xl shadow-lg animate-pulse">
            <p className="text-xl font-medium text-blue-600">Carregando Perfil...</p>
            </div>
            </div>
        );
    }

    const imagePath = user.userImagePath || user.profileImageUrl || user.avatarUrl;
    // Passa o objeto user para getProfilePictureUrl
    const profilePicUrl = getProfilePictureUrl(imagePath, user); 

    // Estrutura do Perfil
    return (
        <div className="profile-container"> 
            {/* Cartão do Perfil */}
            <div className="profile-card">

                {/* Cabeçalho do Perfil (Imagem e Nome) */}
                <div className="profile-header">
                    <div className="relative">
                        <img
                            className="profile-avatar"
                            key={imagePath || user.id} // Chave para forçar recarregamento em caso de mudança
                            src={profilePicUrl}
                            alt={`Foto de Perfil de ${user.name || user.username}`}
                            onError={(e) => {
                                // Fallback para avatar de iniciais em caso de erro de carregamento
                                e.target.src = getProfilePictureUrl(null, user); 
                                e.target.onerror = null; 
                            }}
                        />
                    </div> {/* Fim da div 'relative' */}

                    <h1 className="profile-name">
                        {user.name || user.username || 'Usuário Desconhecido'}
                    </h1>
                    <p className="profile-email">{user.email}</p>
                </div> {/* Fim da div 'profile-header' */}

                {/* Detalhes da Conta */}
                <div className="details-section">
                    <h2 className="details-title flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-500"/> Informações da Conta
                    </h2>

                    {/* Linha de Detalhes: Email */}
                    <div className="detail-item">
                        <span className="detail-label flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-indigo-600"/> Email:
                        </span>
                        <span className="detail-value">{user.email}</span>
                    </div>
                    {/* Linha de Detalhes: Usuário (se diferente do nome) */}
                    {(user.username && user.username !== user.name) && (
                        <div className="detail-item">
                            <span className="detail-label flex items-center">
                                <User className="w-5 h-5 mr-2 text-indigo-600"/> Usuário:
                            </span>
                            <span className="detail-value">{user.username}</span>
                        </div>
                    )}
                    {/* Linha de Detalhes: ID */}
                    {user.id && (
                        <div className="detail-item">
                            <span className="detail-label flex items-center">
                                <Hash className="w-5 h-5 mr-2 text-gray-500"/> ID de Usuário:
                            </span>
                            <span className="detail-value">{user.id}</span>
                        </div>
                    )}
                        
                    {/* Botão de Logout */}
                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="btn-logout"
                    >
                        {isLoading ? (
                            <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saindo...
                            </>
                        ) : (
                            <>
                                <LogOut className="w-5 h-5 mr-2" /> Sair da Conta
                            </>
                        )}
                    </button>

                    {/* Botão de Edição */}
                    <button 
                        onClick={() => navigate('/edit-profile')}
                        className="btn-edit"
                    >
                        <Edit className="w-5 h-5 mr-2" /> Editar Perfil
                    </button>
                </div> {/* Fim da div 'details-section' */}

                {/* Seção de Postagens do Usuário */}
                <UserPostsSection userId={user.id} name={user.name || user.username} />
            </div> {/* Fim da div 'profile-card' */}
        </div> 
    );
}

export default ProfilePage;
