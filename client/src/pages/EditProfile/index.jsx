import React, { useState , useCallback, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/users'
const BACKEND_URL = 'http://localhost:3000';
const DEFAULT_AVATAR_URL = 'https://placehold.co/120x120/007bff/ffffff?text=AV';


const EditProfile = () => {
    // 1. OBTENÇÃO DA FUNÇÃO DO CONTEXTO
    const { user, updateUserAvatarPath } = useContext(AuthContext);
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Estados para o gerenciamento de arquivos e UI
    const [profileImage, setProfileImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(DEFAULT_AVATAR_URL); 

    const [removeProfileImage, setRemoveProfileImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Obtém o token
    const token = localStorage.getItem('userToken'); 

    // Função de URL de Imagem (corrigida e usada no useEffect e no handleSubmit)
    const getProfilePictureUrl = useCallback((path) => {
        // ... sua lógica de URL (correta) ...
        if (!path) return DEFAULT_AVATAR_URL;

        const normalizedPath = path.replace(/\\/g, '/');
        const startIndex = normalizedPath.indexOf('uploads/');
        let relativePath = normalizedPath;
        if (startIndex !== -1) {
            relativePath = normalizedPath.substring(startIndex); 
        } 
        let finalUrl = `${BACKEND_URL}/${relativePath}`;
        finalUrl += `?t=${new Date().getTime()}`; // Anti-cache
        return finalUrl;
    }, []);
    
    // Função para buscar dados do usuário (correta)
    const fetchUserData = useCallback(async () => {
        // ... (Sua lógica fetchUserData) ...
        // ...
        try {
            const url = `${API_BASE_URL}/details`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                let errorData = {};
                try { errorData = await response.json(); } catch(e) { /* ignore non-json error */ }
                const errorMessage = errorData.message || 
                    (response.status === 404 ? `Erro 404: Rota GET ${url} não encontrada.` : response.statusText) || 
                    `Falha ao carregar dados do usuário (Status: ${response.status}).`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const userData = data?.user;

            if (!userData || !userData.username) {
                console.error("API retornou dados inválidos ou incompletos:", data);
                throw new Error("Estrutura de dados inválida. Objeto de usuário não encontrado.");
            }
            // Preenche os estados com os dados retornados
            setUsername(userData.username || '');
            setEmail(userData.email || '');

            if (userData.userImagePath) {
                setCurrentImageUrl(getProfilePictureUrl(userData.userImagePath));
            }
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
            if (err.message && err.message.includes('Failed to fetch')) {
                setError('Erro de Rede: Não foi possível conectar ao backend (http://localhost:3000). O servidor está ativo?');
            } else {
                setError(err.message || 'Erro ao conectar com o servidor.');
            }
        } finally {
            setDataLoaded(true);
        }
    }, [token, navigate, getProfilePictureUrl]);

    // Efeito para carregar dados
    useEffect(() => {
        if (!token) {
            setError('Usuário não autenticado. Redirecionando...');
            setDataLoaded(true);
            navigate('/login'); 
            return;
        }

        fetchUserData();
    }, [token, navigate, fetchUserData]);

    // 2. Manejadores de eventos (handleFileChange, handleRemoveImage, handleCancelRemove - Mantidos)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProfileImage(file);
        setRemoveProfileImage(false);
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setRemoveProfileImage(true); 
    };

    const handleCancelRemove = () => {
        setRemoveProfileImage(false);
    };

    // 3. MANEJADOR DE ENVIO (CORRIGIDO)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        // ... (Verificações iniciais - Mantidas) ...
        if (!token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        let detailsUpdateSuccess = false;
        let detailsError = null;
        let avatarUpdateSuccess = false;
        let avatarError = null;
        let newAvatarPath = null; // Variável para armazenar o novo caminho

        const isDetailsOrPasswordUpdate = username || email || newPassword;
        const isAvatarUpdate = profileImage;
        const isAvatarRemoval = removeProfileImage && currentImageUrl !== DEFAULT_AVATAR_URL;

        // 1. ATUALIZAÇÃO DE DETALHES/SENHA (Mantida)
        if (isDetailsOrPasswordUpdate || currentPassword) {
            // ... (Sua lógica de PATCH /details) ...
             try {
                if (!currentPassword) {
                    throw new Error("A senha atual é obrigatória para guardar as alterações de detalhes ou de senha.");
                }

                const updateDetailsPayload = {
                    username,
                    email,
                    currentPassword,
                    newPassword: newPassword || undefined,
                };

                const detailsUrl = `${API_BASE_URL}/details`;
                const detailsResponse = await fetch(detailsUrl, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(updateDetailsPayload),
                });

                if (detailsResponse.ok) {
                    detailsUpdateSuccess = true;
                } else {
                    let detailsData = {};
                    try { detailsData = await detailsResponse.json(); } catch (e) { /* ignore non-json error */ }

                    const errorMessage = detailsData.message || 
                        (detailsResponse.status === 404 ? `Erro 404: Rota PATCH ${detailsUrl} não encontrada.` : detailsResponse.statusText) || 
                        `Falha desconhecida ao atualizar detalhes (Status: ${detailsResponse.status}).`;

                    throw new Error(errorMessage);
                }

            } catch (err) {
                console.error('Erro de Detalhes:', err);
                if (err.message.includes('Failed to fetch')) {
                    detailsError = 'Erro de Rede: Não foi possível conectar ao backend. O servidor está ativo?';
                } else {
                    detailsError = err.message || 'Erro ao atualizar detalhes do perfil.';
                }
            }
        }


        // 2a. REMOÇÃO DE IMAGEM
        if (isAvatarRemoval) {
            try {
                const removeAvatarUrl = `${API_BASE_URL}/avatar/remove`; 
                const removeAvatarResponse = await fetch(removeAvatarUrl, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (removeAvatarResponse.ok) {
                    avatarUpdateSuccess = true;
                    newAvatarPath = null; // 💡 Define o novo caminho como NULO (para remover/usar padrão)
                    setCurrentImageUrl(DEFAULT_AVATAR_URL); 
                    setRemoveProfileImage(false); 
                } else {
                    // ... (Tratamento de erro de remoção) ...
                     let avatarData = {};
                    try { avatarData = await removeAvatarResponse.json(); } catch (e) { /* ignore non-json error */ }

                    const errorMessage = avatarData.message || removeAvatarResponse.statusText || 
                        `Falha desconhecida ao remover avatar (Status: ${removeAvatarResponse.status}).`;

                    throw new Error(errorMessage);
                }

            } catch (err) {
                console.error('Erro de Remoção de Avatar Detalhado:', err);
                avatarError = err.message || 'Erro ao remover avatar.';
            }
        }


        // 2b. UPLOAD DE NOVA IMAGEM
        else if (isAvatarUpdate) {
            try {
                const formData = new FormData();
                formData.append('avatar', profileImage); 

                const avatarUrl = `${API_BASE_URL}/avatar`;
                const avatarResponse = await fetch(avatarUrl, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });

                if (avatarResponse.ok) {
                    avatarUpdateSuccess = true;
                    const avatarData = await avatarResponse.json();

                    if(avatarData.userImagePath) {
                        newAvatarPath = avatarData.userImagePath; // 💡 Obtém o novo caminho
                        setCurrentImageUrl(getProfilePictureUrl(newAvatarPath));
                    }
                    setProfileImage(null); 
                    setRemoveProfileImage(false);
                } else {
                    // ... (Tratamento de erro de upload) ...
                    let avatarData = {};
                    try { avatarData = await avatarResponse.json(); } catch (e) { /* ignore non-json error */ }

                    const errorMessage = avatarData.message || 
                        (avatarResponse.status === 404 ? `Erro 404: Rota PATCH ${avatarUrl} não encontrada.` : avatarResponse.statusText) || 
                        `Falha desconhecida com status ${avatarResponse.status}.`;

                    throw new Error(errorMessage);
                }

            } catch (err) {
                console.error('Erro de Upload de Avatar Detalhado:', err);
                if (err.message.includes('Failed to fetch')) {
                    avatarError = 'Erro de Rede: Não foi possível conectar ao backend. Verifique se o servidor está rodando.';
                } else {
                    avatarError = err.message || 'Erro de aplicação ao atualizar avatar.';
                }
            }
        }
        
        // 3. COMBINAR E EXIBIR MENSAGENS DE ERRO/SUCESSO
        // ... (Sua lógica de mensagens - Mantida) ...
        let finalSuccessMessage = [];
        let finalErrorMessage = [];

        if (detailsError) {
            finalErrorMessage.push(`Detalhes: ${detailsError}`);
        } else if (isDetailsOrPasswordUpdate && detailsUpdateSuccess) {
            finalSuccessMessage.push('Detalhes (Nome/Email/Senha) atualizados.');
        }

        if (avatarError) {
            finalErrorMessage.push(`Avatar: ${avatarError}`);
        } else if ((isAvatarUpdate || isAvatarRemoval) && avatarUpdateSuccess) {
            finalSuccessMessage.push(isAvatarRemoval ? 'Avatar removido com sucesso.' : 'Avatar atualizado com sucesso.');
        }


        if (finalErrorMessage.length > 0) {
            setError(finalErrorMessage.join(' | '));
        } else if (finalSuccessMessage.length > 0) {
            setSuccess(`✅ ${finalSuccessMessage.join(' e ')}`);
            // Limpa campos de senha
            setCurrentPassword('');
            setNewPassword('');
            
            // 🎯 AÇÃO CRÍTICA: ATUALIZA O CONTEXTO SE O AVATAR FOI MUDADO
            if (isAvatarUpdate || isAvatarRemoval) {
                // newAvatarPath será o novo caminho (string) ou null (se removido)
                updateUserAvatarPath(newAvatarPath); 
            }
            
            // 🎯 REDIRECIONAMENTO APÓS SUCESSO
            // É melhor não redirecionar imediatamente após um PATCH/PUT para dar tempo do usuário ver a mensagem. 
            // Mas, se for o comportamento desejado, descomente abaixo ou use um setTimeout:
            // navigate('/profile'); 
            
        } else {
            setSuccess("Nenhuma alteração detectada para salvar.");
        }


        setLoading(false);
    }; 
    
    // 🛑 REMOVIDAS AS LINHAS ABAIXO QUE CAUSAVAM O ERRO:
    // updateUserAvatarPath(newPath);
    // navigate('/profile');


    // ... (Lógica de pré-visualização e JSX - Mantidos) ...
    const avatarToDisplay = removeProfileImage
        ? DEFAULT_AVATAR_URL 
        : profileImage
            ? URL.createObjectURL(profileImage) 
            : currentImageUrl; 

    if (!dataLoaded) {
        return (
            <div style={{ ...styles.pageContainer, color: '#007bff' }}>
                <p>Cargando datos del perfil...</p>
            </div>
        );
    }

    return (
        // ... seu JSX aqui ...
        <div style={styles.pageContainer}>
             <div style={styles.card}>
                <h2 style={styles.title}>Editar Perfil</h2>
                <div style={styles.avatarContainer}>
                    <img src={avatarToDisplay} alt="Avatar actual" style={styles.avatar} />
                    <p style={styles.usernameDisplay}>{username}</p>
                </div>
                {error && <p style={styles.error}>🚨 {error}</p>}
                {success && <p style={styles.success}>✨ {success}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* ... campos do formulário ... */}
                    
                     <div style={styles.sectionTitle}>Información de Cuenta</div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nombre de Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={styles.input}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div style={styles.sectionTitle}>Cambiar Contraseña (Opcional)</div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Contraseña Actual</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                style={styles.input}
                                placeholder="Necesaria para cualquier cambio"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nueva Contraseña</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={styles.input}
                                placeholder="Déjalo vacío si no deseas cambiarla"
                                disabled={loading}
                            />
                        </div>
                    
                    {/* Campo de Carga de Imagen - AGORA COM OPÇÃO DE REMOVER */}
                    <div style={{ ...styles.inputGroup, ...styles.fileInputContainer }}>
                        <label style={{ ...styles.label, marginBottom: '10px' }}>
                            🖼️ Atualizar ou Remover Foto de Perfil
                        </label>

                        {/* Botão de Remoção Condicional */}
                        {currentImageUrl !== DEFAULT_AVATAR_URL && !removeProfileImage && (
                            <button 
                                type="button" 
                                onClick={handleRemoveImage} 
                                style={{...styles.removeButton, marginBottom: '10px'}}
                                disabled={loading}
                            >
                                🗑️ Remover Foto Atual
                            </button>
                        )}

                        {/* Opção de Cancelar Remoção */}
                        {removeProfileImage && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                                <p style={styles.warningText}>⚠️ A foto será removida ao salvar.</p>
                                <button 
                                    type="button" 
                                    onClick={handleCancelRemove} 
                                    style={styles.cancelRemoveButton}
                                    disabled={loading}
                                >
                                    Manter Foto Atual
                                </button>
                            </div>
                        )}

                        {/* Input de Upload, desabilitado se a remoção estiver pendente */}
                        <label style={{ ...styles.label, marginTop: '10px' }}>
                            Ou selecione uma nova imagem:
                        </label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            disabled={loading || removeProfileImage}
                        />

                        {profileImage && <p style={styles.fileName}>Arquivo selecionado: **{profileImage.name}**</p>}

                    </div>

                    <div style={styles.buttonGroup}>
                        <button type="button" onClick={() => navigate(-1)} style={styles.cancelButton} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ... (Restante dos estilos - Mantidos) ...
const styles = {
    // ... estilos
     pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5', 
        fontFamily: 'Inter, Arial, sans-serif',
    },
    card: {
        padding: '35px 40px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        width: '450px', 
        maxWidth: '90%',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
        fontSize: '26px',
        borderBottom: '3px solid #007bff',
        paddingBottom: '10px',
        fontWeight: '700',
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
    },
    avatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #007bff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    usernameDisplay: {
        marginTop: '10px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#007bff',
        marginTop: '15px',
        marginBottom: '10px',
        borderLeft: '4px solid #007bff',
        paddingLeft: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '600',
        color: '#555',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        fontSize: '16px',
        transition: 'border-color 0.3s',
    },
    fileInputContainer: {
        border: '1px dashed #ccc', 
        padding: '15px', 
        borderRadius: '8px', 
        backgroundColor: '#fafafa',
    },
    fileName: {
        fontSize: '12px',
        marginTop: '8px',
        color: '#007bff',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '25px',
        gap: '15px',
    },
    button: {
        flex: 1,
        padding: '12px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.1s ease',
    },
    cancelButton: {
        flex: 1,
        padding: '12px 15px',
        backgroundColor: '#6c757d', 
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    },
    removeButton: { 
        padding: '8px 15px',
        backgroundColor: '#dc3545', 
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        width: '100%',
        transition: 'background-color 0.3s ease',
    },
    cancelRemoveButton: { 
        padding: '8px 15px',
        backgroundColor: '#ffc107', 
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        marginTop: '8px',
        width: '100%',
    },
    warningText: { 
        color: '#ffc107',
        fontWeight: '600',
        fontSize: '14px',
        marginBottom: '5px',
        textAlign: 'center',
        backgroundColor: '#fffbe6',
        padding: '5px',
        borderRadius: '4px',
    },
    error: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        padding: '10px',
        borderRadius: '6px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '1px solid #f5c6cb',
    },
    success: {
        color: '#28a745',
        backgroundColor: '#d4edda',
        padding: '10px',
        borderRadius: '6px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '1px solid #c3e6cb',
    }
};

export default EditProfile;
