
import React, { useState , useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Assumindo que você usa um contexto
import { useNavigate } from 'react-router-dom'; // Para redirecionar após logout

const API_BASE_URL = 'http://localhost:3000/api/users'



const EditProfile = () => {
    // 1. Estados para los datos del formulario (inicializados con datos mock)

    // Estados para os campos do formulário
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Estados para o gerenciamento de arquivos e UI
    const [profileImage, setProfileImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('https://placehold.co/120x120/007bff/ffffff?text=AV'); 

    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Obtém o token (substitua por seu contexto de autenticação se necessário)
    const token = localStorage.getItem('userToken'); 

    // Dentro do componente EditProfile
// Dentro do componente EditProfile.jsx

const getProfilePictureUrl = (path) => {
    const BACKEND_URL = 'http://localhost:3000';
    
    // ... (restante da lógica de fallback e URLs externas)

    // 1. Normaliza as barras do caminho de arquivo do Windows
    const normalizedPath = path.replace(/\\/g, '/');
    
    // 2. Encontra a posição onde a string 'uploads/' começa
    const startIndex = normalizedPath.indexOf('uploads/');
    
    let relativePath = normalizedPath;
    
    // 3. Extrai o caminho relativo, INCLUINDO "uploads/"
    if (startIndex !== -1) {
        // 🛑 CORREÇÃO: Pega a substring a partir da posição da palavra "uploads/"
        relativePath = normalizedPath.substring(startIndex); 
        // Agora, relativePath deve ser: "uploads/temp/avatar-*.jpg"
    } 
    
    // 4. Constrói a URL FINAL
    const finalUrl = `${BACKEND_URL}/${relativePath}`;
    
    // Verifique se o log agora mostra "uploads/..."
    console.log('2. Caminho Relativo CORRIGIDO:', relativePath); 
    console.log('3. URL FINAL CORRIGIDA:', finalUrl); 

    return finalUrl;
};



    useEffect(() => {
        if (!token) {
            setError('Usuário não autenticado. Redirecionando...');
            setDataLoaded(true);
            // navigate('/login'); // Você pode adicionar redirecionamento aqui
            return;
        }

        const fetchUserData = async () => {
            try {
                const url = `${API_BASE_URL}/edit-profile`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    // Tenta ler o JSON de erro se houver
                    let errorData = {};
                    try {
                        errorData = await response.json();
                    } catch(e) { /* ignore non-json error */ }

                    // Adiciona mensagem específica para 404 na URL de carregamento
                    const errorMessage = errorData.message || 
                        (response.status === 404 ? `Erro 404: Rota GET ${url} não encontrada.` : response.statusText) || 
                        `Falha ao carregar dados do usuário (Status: ${response.status}).`;

                    throw new Error(errorMessage);
                }

                const data = await response.json();
                                
                                // 🛑 CORREÇÃO PRINCIPAL: Verificação de existência do objeto 'user'
                                // Usa Encadeamento Opcional para evitar o erro "Cannot read properties of undefined"
                                const userData = data?.user;
                // const userData = data;

                if (!userData || !userData.username) {
                    // Se 'data' não tiver 'username', lança um erro
                    console.error("API retornou dados inválidos ou incompletos:", data);
                    throw new Error("Estrutura de dados inválida. Objeto de usuário não encontrado.");
                    }
                    // Preenche os estados com os dados retornados
                    setUsername(userData.username || ''); // Acessa userData em vez de data.user
                    setEmail(userData.email || ''); // Acessa userData em vez de data.user
                   
                    if (userData.userImagePath) {
                        setCurrentImageUrl(getProfilePictureUrl(userData.userImagePath));
                    }
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
                // Detecta erro de rede e fornece mensagem clara
                if (err.message && err.message.includes('Failed to fetch')) {
                    setError('Erro de Rede: Não foi possível conectar ao backend (http://localhost:3000). O servidor está ativo?');
                } else {
                    setError(err.message || 'Erro ao conectar com o servidor.');
                }
            } finally {
                setDataLoaded(true);
            }
        };

        fetchUserData();
    }, [token]);

    // 2. Manejadores de eventos
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProfileImage(file);
        // Pré-visualiza a nova imagem localmente
        setCurrentImageUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (!token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        let detailsUpdateSuccess = false;
        let detailsError = null;
        let avatarError = null;

        // --- 2a. ATUALIZAR DETALHES DE TEXTO E SENHA (PATCH /) ---
        try {
            // Verifica se a senha atual é fornecida (obrigatório pelo userController para qualquer atualização)
            if (!currentPassword) {
                throw new Error("A senha atual é obrigatória para guardar as alterações de detalhes ou de senha.");
            }

            const updateDetailsPayload = {
                username,
                email,
                currentPassword,
                newPassword: newPassword || undefined, 
            };

            const detailsUrl = `${API_BASE_URL}/`;
            // Requisição PATCH para atualizar texto
            const detailsResponse = await fetch(detailsUrl, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateDetailsPayload),
            });

            if (detailsResponse.ok) {
                detailsUpdateSuccess = true;
            } else {
                let detailsData = {};
                try {
                    detailsData = await detailsResponse.json();
                } catch (e) {
                    // Caso o servidor retorne um status de erro (ex: 500) sem um corpo JSON
                    console.error("Detalhes: Resposta de erro do servidor não-JSON ou vazia. Status:", detailsResponse.status);
                }

                // Adiciona mensagem específica para 404 nos detalhes
                const errorMessage = detailsData.message || 
                    (detailsResponse.status === 404 ? `Erro 404: Rota PATCH ${detailsUrl} não encontrada.` : detailsResponse.statusText) || 
                    `Falha desconhecida com status ${detailsResponse.status}.`;

                throw new Error(errorMessage);
            }

        } catch (err) {
            console.error('Erro de Detalhes Detalhado:', err);
            if (err.message.includes('Failed to fetch')) {
                detailsError = 'Erro de Rede: Não foi possível conectar ao backend (http://localhost:3000). Verifique se o servidor está rodando e se o CORS está configurado.';
            } else {
                detailsError = err.message || 'Erro de aplicação ao atualizar detalhes.';
            }
        }

        // --- 2b. ATUALIZAR IMAGEM (PATCH /update-avatar) ---
        if (profileImage) {
            try {
                const formData = new FormData();
                formData.append('avatar', profileImage); // 'avatar' DEVE corresponder ao campo em userRoutes.ts

                const avatarUrl = `${API_BASE_URL}/update-avatar`;
                const avatarResponse = await fetch(avatarUrl, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (avatarResponse.ok) {
                    const avatarData = await avatarResponse.json();

                    // Atualiza o URL da imagem atual com o novo caminho retornado pelo servidor
                    if(avatarData.userImagePath) {
                        setCurrentImageUrl(getProfilePictureUrl(avatarData.userImagePath));
                    }
                    setProfileImage(null); // Limpa o estado da imagem pendente
                } else {
                    let avatarData = {};
                    try {
                        avatarData = await avatarResponse.json();
                    } catch (e) {
                        // Caso o servidor retorne um status de erro (ex: 500) sem um corpo JSON
                        console.error("Avatar: Resposta de erro do servidor não-JSON ou vazia. Status:", avatarResponse.status);
                    }

                    // Adiciona mensagem específica para 404 no avatar
                    const errorMessage = avatarData.message || 
                        (avatarResponse.status === 404 ? `Erro 404: Rota PATCH ${avatarUrl} não encontrada.` : avatarResponse.statusText) || 
                        `Falha desconhecida com status ${avatarResponse.status}.`;

                    throw new Error(errorMessage);
                }

            } catch (err) {
                console.error('Erro de Avatar Detalhado:', err);
                if (err.message.includes('Failed to fetch')) {
                    avatarError = 'Erro de Rede: Não foi possível conectar ao backend (http://localhost:3000). Verifique se o servidor está rodando e se o CORS está configurado.';
                } else {
                    avatarError = err.message || 'Erro de aplicação ao atualizar avatar.';
                }
            }
        }

        // 3. COMBINAR E EXIBIR MENSAGENS DE ERRO/SUCESSO

        // Se houve erro nos detalhes e no avatar
        if (detailsError && avatarError) {
            setError(`Houve falhas múltiplas. Detalhes: [${detailsError}]. Avatar: [${avatarError}]. Verifique se o servidor está ativo.`);
        } 
        // Se houve erro apenas nos detalhes (o avatar nem foi tentado ou já deu erro antes)
        else if (detailsError) {
            setError(`Falha ao atualizar detalhes do perfil: ${detailsError}.`);
        } 
        // Se a atualização de detalhes foi bem-sucedida, mas o avatar falhou
        else if (detailsUpdateSuccess && avatarError) {
            setError(`Detalhes do perfil atualizados com sucesso, mas houve falha ao atualizar o Avatar: ${avatarError}.`);
        } 
        // Se o avatar falhou mas nenhum detalhe foi alterado (apenas para casos onde só a imagem foi submetida)
        else if (!detailsUpdateSuccess && avatarError && profileImage) {
            setError(`Falha ao atualizar o Avatar: ${avatarError}.`);
        }
        // Se tudo foi bem (ou se apenas o avatar foi atualizado com sucesso e não havia detalhes para atualizar)
        else if (detailsUpdateSuccess || profileImage) {
            setSuccess("¡Perfil atualizado com éxito!");
            setCurrentPassword('');
            setNewPassword('');
        }

        setLoading(false);
    };

    // Placeholder para a imagem de perfil
    const avatarToDisplay = profileImage 
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
            <div style={styles.pageContainer}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Editar Perfil</h2>

                    {/* Visualização do Avatar atual */}
                    <div style={styles.avatarContainer}>
                        <img src={avatarToDisplay} alt="Avatar actual" style={styles.avatar} />
                        <p style={styles.usernameDisplay}>{username}</p>
                    </div>

                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {/* Campos de Información Básica */}
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

                        {/* Sección de Cambio de Contraseña */}
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
                                required // Mantida como requerida pelo userController
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

                        {/* Campo de Carga de Imagen */}
                        <div style={{ ...styles.inputGroup, ...styles.fileInputContainer }}>
                            <label style={{ ...styles.label, marginBottom: '5px' }}>
                                Actualizar Foto de Perfil
                            </label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                            {profileImage && <p style={styles.fileName}>Archivo seleccionado: {profileImage.name}</p>}
                        </div>

                        <div style={styles.buttonGroup}>
                            <button type="button" onClick={() => window.history.back()} style={styles.cancelButton} disabled={loading}>
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

// Estilos limpios y centrados
const styles = {
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

