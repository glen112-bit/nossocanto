import React, { useState } from "react";
// 🛑 Importar el servicio de autenticación que crearás
import { registerUser } from '../../services/authService';
// 🛑 Importar el contexto de autenticación (si lo tienes)
// import { useAuth } from '../../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

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
        backgroundColor: "#28A745", // Verde para Registro
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s",
        marginTop: "10px",
    },
    // Efecto hover para la interacción
    buttonHover: {
        backgroundColor: "#1E7E34",
    },
    error: {
        color: 'red',
        marginBottom: '15px',
        fontWeight: 500,
    }
};

const Register = () => {
    const [username, setUsername] = useState(""); // Nuevo campo
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Nuevo campo
    const [isHovering, setIsHovering] = useState(false);
    const [error, setError] = useState(null); // Para mostrar errores

    // const { login } = useAuth(); // Asumiendo que tienes un contexto de autenticación

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos

        // 1. Validación de Contraseñas
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        // 2. Validación de Largo (opcional)
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            // 3. 🛑 Llama al servicio de registro (authService)
            const userData = await registerUser(username, email, password);
            
            // Lógica simulada:
            console.log("Datos enviados al backend para registro:", { username, email, password });

            // 4. Manejo de éxito
            alert("¡Registro exitoso! Por favor, inicia sesión.");
            // history.push('/login'); // Redirigir al login
            
        } catch (err) {
            // 5. Manejo de errores de la API (ej: Email ya registrado)
            const apiErrorMessage = err.message || "Error al intentar registrar el usuario.";
            setError(apiErrorMessage);
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Crear Cuenta</h2>
            
            <form onSubmit={handleSubmit} style={{ margin: 0, padding: 0 }}>

                {error && <p style={styles.error}>{error}</p>}

                {/* Campo Nombre de Usuario */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nombre de Usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                
                {/* Campo Email */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
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
                    />
                </div>
                
                {/* Campo Confirmar Contraseña */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Confirmar Contraseña:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                
                {/* Botón de Registro */}
                <button 
                    type="submit"
                    style={{ 
                        ...styles.button,
                        ...(isHovering ? styles.buttonHover : null)
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    Regístrate
                </button>
                
            </form>
            
            {/* Link a Login */}
            <p 
                onClick = {()=> navigate('/#/login')}
                style={{ marginTop: '20px', color: '#888', fontSize: '14px' }}>
                ¿Ya tienes cuenta? <a href="/login" style={{ color: '#007AFF', textDecoration: 'none', fontWeight: 600 }}>Inicia Sesión</a>
            </p>
        </div>
    );
};

export default Register;
