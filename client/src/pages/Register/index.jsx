import React, { useState } from 'react';
// Eliminadas las importaciones de useNavigate y axios.
// Se recomienda usar el sistema de navegación del componente App superior si está disponible.

const REGISTER_URL = 'http://localhost:3000/api/auth/register'; 

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [profileImage, setProfileImage] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false); // Nuevo estado para éxito

    // Manejar la selección del archivo
    const handleFileChange = (event) => {
        setProfileImage(event.target.files[0]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        // 1. Criar o objeto FormData (CORRECTO)
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        // O nome do campo no backend para a imagem deve ser 'avatar'
        if (profileImage) {
            formData.append('avatar', profileImage); 
        }

        try {
            // CORRECCIÓN CLAVE: Enviar FormData como body, y NO especificar Content-Type
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                // ELIMINADA línea: headers: { 'Content-Type': 'application/json' },
                body: formData, // Enviar el objeto FormData que incluye el archivo
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('Registro exitoso:', data);
                setIsRegistered(true); // Cambia a la vista de éxito
            } else {
                setError(data.message || 'Error en el registro. Inténtelo de nuevo.');
            }
        } catch (err) {
            console.error('Error de red:', err);
            setError('No se pudo conectar con el servidor. Verifique que su servidor backend esté activo en el puerto 3000 y tenga CORS habilitado.');
        } finally {
            setLoading(false);
        }
    };

    // Si el registro fue exitoso, muestra un mensaje de éxito (simulando la navegación)
    if (isRegistered) {
        return (
            <div style={styles.pageContainer}>
                <div style={styles.card}>
                    <h2 style={styles.titleSuccess}>Registro Exitoso</h2>
                    <p style={{ textAlign: 'center', color: '#555' }}>
                        ¡Tu cuenta ha sido creada y la imagen de perfil ha sido subida!
                    </p>
                    {/* Botón para volver o navegar al login */}
                    <button onClick={() => setIsRegistered(false)} style={{ ...styles.button, backgroundColor: '#1976d2', marginTop: '20px' }}>
                        Volver al formulario
                    </button>
                </div>
            </div>
        );
    }


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
                    
                    {/* Campo de carga de imagen */}
                    <div style={{ ...styles.inputGroup, border: '1px dashed #ccc', padding: '10px', borderRadius: '8px' }}>
                         <label style={{ ...styles.label, marginBottom: '5px' }}>Imagen de Perfil (Avatar)</label>
                        <input 
                            type="file" 
                            name="profileImage" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            // Eliminado 'required' para hacerlo opcional, ajustando la lógica de backend
                            disabled={loading}
                        />
                    </div>

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

// 2. Estilos limpios y consistentes
const styles = {
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
    titleSuccess: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#28a745',
        fontSize: '24px',
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
