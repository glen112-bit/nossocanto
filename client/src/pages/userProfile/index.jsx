import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Assumindo que você usa um contexto
import { useNavigate } from 'react-router-dom'; // Para redirecionar após logout
import { LogOut, User, Mail, Hash } from 'lucide-react'; // Ícones modernos
import './style.css'

// --- Assuma que esta é a URL base do seu backend para uploads ---
const BACKEND_URL = 'http://localhost:3000';

function ProfilePage() {
    // Substitua 'AuthContext' pelo seu método real de gerenciamento de estado global
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Função auxiliar para obter a URL correta da imagem
    const getProfilePictureUrl = (path) => {
        // Se o caminho for nulo ou vazio, retorna o avatar padrão
        if (!path || typeof path !== 'string' || path.trim() === '') {
            // Retorna um avatar gerado se o nome/email estiver disponível
            const nameToUse = user?.name || user?.username || user?.email?.split('@')[0];
            const initials = nameToUse ? nameToUse.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
            // Avatar mais moderno com cor primária
            return `https://ui-avatars.com/api/?name=${initials}&background=1D4ED8&color=FFFFFF&size=128&bold=true`;
        }
            console.log('datos de usuario: ', user)
            // Se for uma URL externa (Google, etc.), retorna a URL diretamente
            if (path && path.startsWith('http')) {
                return path;
            }
            // 3. Caso de Caminho Local (Multer/Upload)
            // O backend deve salvar: 'uploads/ID_DO_USUARIO/nome.jpg'

            // Normaliza o caminho para ter barras '/' (Windows usa '\')
            const normalizedPath = path.replace(/\\/g, '/');

            // Garante que o caminho não comece com '/uploads/' duplicado no servidor
            // Ex: Se o DB tiver 'uploads/ID/img.jpg', precisamos de '/uploads/ID/img.jpg'
            const finalPathSegment = normalizedPath.startsWith('uploads/') 
                ? normalizedPath // Se já começa com 'uploads/', usamos o caminho completo
                : `uploads/${normalizedPath}`; // Se o DB salvou apenas 'ID/img.jpg'

                // Constrói a URL completa
                const finalUrl = `${BACKEND_URL}/${finalPathSegment}`;

                console.log('Caminho no DB:', path);
                console.log('URL Final (A ser solicitada):', finalUrl); // 🛑 VERIFIQUE ESTA URL NO CONSOLE

                return finalUrl;
                // Se for um caminho local (Multer), constrói a URL completa
                // Retorna um avatar padrão se todas as outras verificações falharem
    };

    // Lógica de Logout
    const handleLogout = () => {
        setIsLoading(true);
        // Simulação de delay para a requisição de logout (melhora a UX)
        setTimeout(() => {
            logout();
            setIsLoading(false);
            navigate('/login');
        }, 500); // 500ms de delay
    };

    if (!user) {
        // Exibe um carregamento mais elegante
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center p-12 bg-white rounded-xl shadow-lg animate-pulse">
            <p className="text-xl font-medium text-blue-600">Carregando Perfil...</p>
            </div>
            </div>
        );
    }

    // Obter a URL da imagem de perfil
    const profilePicUrl = getProfilePictureUrl(user.userImagePath || user.profileImageUrl || user.avatarUrl);

    // Estrutura do Perfil
    return (
        <div className="profile-container"> 
            {/* Cartão do Perfil */}
            <div className="profile-card">

                {/* Cabeçalho do Perfil (Imagem e Nome) */}
            <div className="profile-header">
                <div className="relative">
            <img
                className="profile-avatar" // ⬅️ Classe CSS
                src={profilePicUrl}
                alt={`Foto de Perfil de ${user.name || user.username}`}
                onError={(e) => {
                    e.target.src = getProfilePictureUrl(null); 
                e.target.onerror = null; 
                }}
                />
            </div>

                <h1 className="profile-name">
                    {user.name || user.username || 'Usuário Desconhecido'}
                </h1>
                <p className="profile-email">{user.email}</p>
                </div>

            {/* Detalhes da Conta */}
            <div className="details-section">
                <h2 className="details-title flex items-center">
                    {/* Ícone adicionado aqui para manter a funcionalidade visual, mas a classe CSS principal é 'details-title' */}
                    {/* Ícones como 'User' não são do CSS Puro, mas mantidos para a funcionalidade React */}
                <User className="w-5 h-5 mr-2 text-indigo-500"/> Informações da Conta
                </h2>

                {/* Linha de Detalhes: Email */}
            <div className="detail-item">
                <span className="detail-label flex items-center">
                <Mail className="w-5 h-5 mr-2 text-indigo-600"/> Email:
                    </span>
                    <span className="detail-value">{user.email}</span>
                </div>

                {/* Linha de Detalhes: Nome de Usuário (se diferente do Nome) */}
                {(user.username && user.username !== user.name) && (
                    <div className="detail-item">
            <span className="detail-label flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600"/> Usuário:
            </span>
                <span className="detail-value">{user.username}</span>
            </div>
                )}

                {/* Linha de Detalhes: ID (Opcional) */}
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
                        className="btn-logout" // ⬅️ Classe CSS
                    >
                        {/* O spinner de carregamento (SVG) precisa das classes do Tailwind para animação, ou você precisará adicionar animação/estilo CSS puro. */}
            {isLoading ? (
                <>
                    {/* Este SVG usa classes Tailwind (animate-spin) - se o Tailwind não estiver presente, a animação não funcionará. */}
                    {/* Para CSS Puro, você precisaria definir a regra @keyframes 'spin' no seu ProfilePage.css */}
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

                    {/* Botão de Edição (Opcional) */}
                    <button 
                        onClick={() => navigate('/edit-profile')}
                        className="btn-edit" // ⬅️ Classe CSS
                    >
                        Editar Perfil
                    </button>
            </div>
                    </div>
            </div> 


    );
}

export default ProfilePage;
