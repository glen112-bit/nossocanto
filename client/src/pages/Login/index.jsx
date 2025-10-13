import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; // Si usas React Router para el enlace de registro

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
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

            localStorage.setItem('userToken', data.token);
            window.location.href = '/dashboard'; 
        } catch (err) {
            setError('Error de conexión con el servidor.');
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <h2 style={styles.title}>Iniciar Sesión</h2>
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
                    
                    {/* Link a la página de registro */}
                    <p style={styles.switchText}>
                        ¿No tienes cuenta? <a href="/#/register" style={styles.link}>Regístrate aquí</a>
                    </p>
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
        backgroundColor: '#f0f2f5', // Fondo suave
        fontFamily: 'Arial, sans-serif',
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
