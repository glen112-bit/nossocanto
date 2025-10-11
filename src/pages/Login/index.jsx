import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
// IMPORTANTE: Adicione o serviço de API aqui se ele estiver separado.
import { loginUser } from '../../services/authService';

// Estilos centrales definidos fuera del componente para mejor legibilidad
const styles = {
    container: {
        marginTop: "140px",
        maxWidth: "400px",
        margin: "auto",
        padding: "35px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    title: {
        marginBottom: "25px",
        color: "#333",
        fontWeight: 600,
        fontSize: "28px",
    },
    inputGroup: {
        marginBottom: "20px",
        textAlign: "left",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: 500,
        color: "#555",
    },
    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxSizing: "border-box",
        transition: "border-color 0.3s",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#007AFF",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s",
        marginTop: "10px",
    },
    buttonHover: {
        backgroundColor: "#005BB5",
    },
    buttonDisabled: { // Estilo para o estado desabilitado (carregando)
        backgroundColor: "#99caff",
        cursor: "not-allowed",
    },
    error: {
        color: 'red',
        marginTop: '15px',
        fontWeight: 'bold',
        fontSize: '14px',
    }
};

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // 💡 CORREÇÃO 1: A função handleSubmit deve ser ASYNC para usar await
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Inicia o carregamento
        setError(null);    // Limpa erros anteriores

        try {
            // Assumimos que a função 'login' do AuthContext
            // chama o authService.js (loginUser) internamente.
            await login(email, password); 
            
            // Redireciona para o feed após o login bem-sucedido
            navigate("/feed", { replace: true });

        } catch (err) {
            // Se houver erro (rede, credenciais inválidas, etc.)
            const errorMessage = err.message || "Credenciais inválidas ou erro de rede.";
            setError(errorMessage);

        } finally {
            // 💡 CORREÇÃO 2: Sempre para o estado de carregamento no final
            // (Isso é importante se a navegação falhar ou se o AuthContext não limpar o loading)
            setLoading(false); 
        }
        console.log("Login tentado com:", email, password);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Iniciar Sesión</h2>
            
            {/* Mensagem de Erro */}
            
            <form onSubmit={handleSubmit} style={{ margin: 0, padding: 0 }}>
                
                {/* Campo Email */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                        disabled={loading} // Desabilita durante o carregamento
                    />
                </div>
                
                {/* Campo Contraseña */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                        disabled={loading} // Desabilita durante o carregamento
                    />
                </div>
                
                {/* Botón de Login */}
                <button 
                    type="submit"
                    disabled={loading} // Desabilita se estiver carregando
                    style={{ 
                        ...styles.button,
                        // Aplica o estilo de hover OU desabilitado
                        ...(loading ? styles.buttonDisabled : isHovering ? styles.buttonHover : null)
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
                
            </form>
            
            {/* Link de Registro */}
            <p style={{ marginTop: '20px', color: '#888', fontSize: '14px' }}>
                ¿No tienes cuenta? <Link to="/register" style={{ color: '#007AFF', textDecoration: 'none', fontWeight: 600 }}>Regístrate</Link>
            </p>
        </div>
    );
};

export default Login;
