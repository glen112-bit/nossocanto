import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [profileImage, setProfileImage] = useState(null); // Para o objeto File
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        // 1. Criar o objeto FormData
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (profileImage) {
            formData.append('profileImage', profileImage); 
        }
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Muestra el mensaje de error del backend (ej: "Email ya registrado")
                setError(data.message || 'Error al crear la cuenta.');
                setLoading(false);
                return;
            }

            // Registro e inicio de sesión automático exitoso
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
                <h2 style={styles.title}>Crear Cuenta</h2>
                <form onSubmit={handleSubmit} style={styles.form}>

                    {error && <p style={styles.error}>{error}</p>}

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
                    <input 
                        type="file" 
                        name="profileImage" // Nome opcional, mas útil
                        accept="image/*" // Permite apenas arquivos de imagem
                        onChange={e => setProfileImage(e.target.files[0])} 
                        required 
                    />
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>

                    {/* Link a la página de login usando el hash router */}
                    <p style={styles.switchText}>
                        ¿Ya tienes cuenta? <a href="/#/login" style={styles.link}>Inicia sesión</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

// 2. Estilos limpios y consistentes (ajustando el color principal a verde)
const styles = {
    // Estilos del contenedor y tarjeta son idénticos al Login para consistencia
    pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5', 
        fontFamily: 'Arial, sans-serif',
    },
    card: {
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '380px',
        maxWidth: '90%',
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333',
        fontSize: '24px',
        borderBottom: '2px solid #28a745', // Verde para registro
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
        backgroundColor: '#28a745', // Verde para el botón de registro
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
        color: '#28a745', // Link verde
        textDecoration: 'none',
        fontWeight: 'bold',
    }
};

export default Register;
