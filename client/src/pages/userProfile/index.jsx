import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Assumindo que você usa um contexto
import { useNavigate } from 'react-router-dom'; // Para redirecionar após logout

// --- Assuma que esta é a URL base do seu backend para uploads ---
const BACKEND_URL = 'http://localhost:3000'; 

function ProfilePage() {
    // Substitua 'AuthContext' pelo seu método real de gerenciamento de estado global
    const { user, logout } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Função auxiliar para obter a URL correta da imagem
    const getProfilePictureUrl = (path) => {
        // Se for uma URL externa (Google), retorna a URL diretamente
        // Se o caminho for nulo ou vazio, retorna o avatar padrão
        if (!path) {
            // Retorna um avatar gerado se o nome/email estiver disponível
            const initials = user?.username ? user.username.split(' ').map(n => n[0]).join('') : 'U';
            return `https://ui-avatars.com/api/?name=${initials}&background=3B82F6&color=fff&size=128`;
        }
            if (path && path.startsWith('http')) {
                return path;
            }
            // Se for um caminho local (Multer), constrói a URL completa
            // O path do Multer provavelmente precisa de ajuste (ex: remover 'server\' do caminho)

            if (path) {
                // IMPORTANTE: Se o Multer salvar caminhos com '\', substitua por '/'
                const normalizedPath = path.replace(/\\/g, '/');
                const parts = normalizedPath.split('/uploads/');
                const relativePath = parts.length > 1 ? parts[parts.length - 1] : '';
                if( !relativePath ) {
                    return `${BACKEND_URL}/uploads/DEFAULT_IMAGE_NOT_FOUND_CHECK_LOGIC`;   
                }
                return `${BACKEND_URL}/uploads/${relativePath}`;
            }
            // Retorna um avatar padrão se não houver imagem
            return '/default-avatar.png'; 
    };

    // Lógica de Logout
    const handleLogout = () => {
        setIsLoading(true);
        // Chama a função de logout do seu Context/Redux
        logout(); 
        setIsLoading(false);
        navigate('/login');
    };

    if (!user) {
        // Exibe enquanto carrega ou se não estiver logado (deve redirecionar)
        return <div className="text-center p-8">Carregando perfil...</div>;
    }
    console.log(user)
    // Estrutura do Perfil
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">

                {/* Cabeçalho do Perfil (Imagem e Nome) */}
                <div className="flex flex-col items-center border-b pb-6 mb-6">
                    <img
                        className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-blue-500"
                        src={getProfilePictureUrl(user.userImagePath || user.profileImageUrl || user.avatarUrl)} 
                        alt={`Foto de Perfil de ${user.name || user.username}`}
                        onError={(e) => {
                            console.error("Erro ao carregar a imagem, URL sendo usada:", e.target.src);
                            // Fallback se a imagem falhar ao carregar
                            e.target.src = getProfilePictureUrl(null); 
                        }}
                        // style={{'maxWith: 120px'}}
                        />
                            <h1 className="text-3xl font-bold text-gray-800">
                                {user.name || user.username || 'Usuário'}
                            </h1>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                </div>

                                {/* Detalhes e Estatísticas */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Informações da Conta</h2>

                                    {/* Linha de Detalhes: Email */}
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-gray-600">Email:</span>
                                        <span className="text-gray-800">{user.email}</span>
                                    </div>

                                    {/* Linha de Detalhes: ID (Opcional) */}
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-gray-600">ID de Usuário:</span>
                                        <span className="text-gray-800 text-sm">{user.id}</span>
                                    </div>

                                    {/* Botão de Logout */}
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                        className="w-full mt-6 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Saindo...' : 'Sair da Conta'}
                                    </button>

                                    {/* Botão de Edição (Opcional) */}
                                    {/* <button className="w-full mt-3 py-2 px-4 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition duration-300">
                                        Editar Perfil
                                        </button> */}
                                </div>
                                </div>
                                </div>
    );
                        }

                        // ⚠️ Importante: Lembre-se de importar o AuthContext, bcrypt e jwt em seus arquivos de backend e rotas
                        // e garantir que os dados do usuário estejam disponíveis via user.name, user.email, etc.

                        export default ProfilePage;
