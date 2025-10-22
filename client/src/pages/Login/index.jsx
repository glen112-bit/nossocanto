import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // A URL do seu backend para iniciar o fluxo Google OAuth
    // Deve corresponder à porta do Express (3000) e à rota configurada em server.ts
    const GOOGLE_AUTH_URL = 'http://localhost:3000/auth/google'; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Ajuste a URL para ser absoluta ou relativa a partir da raiz do cliente, se necessário.
            const response = await fetch('http://localhost:3000/api/auth/login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || 'Credenciales incorrectas.');
                setLoading(false);
                return;
            }

// conole.log(response)
            // Lembre-se: idealmente você usaria o AuthContext aqui,
            // mas mantive a lógica original por enquanto.
            localStorage.setItem('userToken', data.token);
            const user = localStorage.getItem('user');
            console.log(user)
            window.location.hash = '/'; // Usando hash para React Router Hash
            window.location.reload()
        } catch (err) {
            setError('Error de conexión con el servidor.');
            setLoading(false);
        }
    };
    
    // Função para iniciar o login do Google (redireciona o navegador)
    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    };
console.log(window.location.href)

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <h2 style={styles.title}>Iniciar Sesión</h2>
                
                {/* Formulário de Login Padrão */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    
                    {error && <p style={styles.error}>{error}</p>}

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

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Accediendo...' : 'Entrar'}
                    </button>
                    
                    {/* Separador */}
                    <div style={styles.separator}>
                        <span style={styles.separatorLine}></span>
                        <span style={styles.separatorText}>OU</span>
                        <span style={styles.separatorLine}></span>
                    </div>

                    {/* Botão de Login com Google */}
                    <button 
                        type="button" 
                        onClick={handleGoogleLogin} 
                        style={{...styles.button, ...styles.googleButton}}
                        disabled={loading}
                    >
                        <svg style={styles.googleIcon} viewBox="0 0 24 24">
                            <path d="M21.516 12.016c0-.62-.054-1.22-.164-1.782h-9.281v3.344h5.275c-.237 1.25-1.025 2.306-2.22 3.016v2.18h2.82c1.65-1.523 2.59-3.79 2.59-6.758z" fill="#4285F4"/>
                            <path d="M12.016 22c3.245 0 5.96-1.08 7.946-2.934l-2.82-2.18c-1.164.793-2.658 1.26-4.062 1.26-3.15 0-5.815-2.124-6.77-4.975H2.336v2.24c2.02 3.99 6.187 6.69 9.68 6.69z" fill="#34A853"/>
                            <path d="M5.246 14.18c-.24-.793-.37-1.636-.37-2.52s.13-1.727.37-2.52V6.826H2.336c-.66 1.32-.99 2.767-.99 4.354s.33 3.033.99 4.354l2.91-2.24z" fill="#FBBC05"/>
                            <path d="M12.016 4.75c1.88 0 3.56.65 4.88 1.834L19.26 3c-1.986-1.854-4.7-2.934-7.244-2.934C6.187.066 2.02 2.766 0 6.756l2.91 2.24c.955-2.85 3.62-4.975 6.77-4.975z" fill="#EA4335"/>
                        </svg>
                        Continuar com o Google
                    </button>
                    <p style={styles.switchText}>
                        ¿No tienes cuenta? <a href="/#/register" style={styles.link}>Regístrate aquí</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

// Estilos limpos e centrados
const styles = {
    pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5', // Fondo suave
        fontFamily: 'Inter, Arial, sans-serif',
    },
    card: {
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', // Sombra más profunda
        width: '380px',
        maxWidth: '90%',
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
        fontSize: '24px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        fontSize: '16px',
    },
    button: {
        padding: '12px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        marginTop: '10px' // Espaço para separar do Google
    },
    // Estilos do botão Google
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4285F4', // Azul do Google
        color: 'white',
        fontWeight: 'normal',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    },
    googleIcon: {
        width: '20px',
        height: '20px',
        marginRight: '10px',
    },
    // Estilos do Separador 'OU'
    separator: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        margin: '20px 0',
        color: '#aaa',
        fontSize: '14px',
    },
    separatorLine: {
        flexGrow: 1,
        height: '1px',
        backgroundColor: '#ddd',
    },
    separatorText: {
        padding: '0 10px',
    },
    error: {
        color: '#d9534f',
        backgroundColor: '#f2dede',
        padding: '10px',
        borderRadius: '6px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '1px solid #ebccd1',
    },
    switchText: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px',
        color: '#777',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold',
    }
};

export default Login;
