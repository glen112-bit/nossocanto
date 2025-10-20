
import * as React from 'react';
import { Box, Typography, Button, Avatar, Paper, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

// URL base del servidor (Misma que en NavigationBar)
const SERVER_BASE_URL = 'http://localhost:3000'; 

// Altura de la barra de navegación para evitar solapamiento (Misma que en NavigationBar)
const NAVIGATION_BAR_HEIGHT = 56;

// Función auxiliar para construir la URL de la imagen de perfil
const getProfileUrl = (path) => {
    if (!path) return null;
    return `${SERVER_BASE_URL}/${path.replace(/\\/g, '/')}`;
};

export default function Profile() {
    const [user, setUser] = React.useState(null); 
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    // Función para obtener la información del usuario actual (replica la lógica de NavigationBar)
    const fetchCurrentUser = React.useCallback(async () => {
        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include', 
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
                // Si no está autenticado, redirigir al login
                navigate("/login");
            }
        } catch (error) {
            console.error('Error al buscar usuario:', error);
            setUser(null);
            navigate("/login");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    React.useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    // Función de cierre de sesión
    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include', 
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Continuar la navegación incluso si la llamada falla, para limpiar el estado local.
        } finally {
            // Limpiar el estado local (si se usara un contexto) y redirigir
            setUser(null); 
            navigate("/", { replace: true });
        }
    };

    // Muestra un indicador de carga mientras se obtienen los datos
    if (loading) {
        return (
            <Box className="flex justify-center items-center h-screen" sx={{ pt: `${NAVIGATION_BAR_HEIGHT}px` }}>
                <CircularProgress />
            </Box>
        );
    }

    // Si no hay usuario (y la redirección a /login no funcionó por alguna razón), mostrar un mensaje
    if (!user) {
        return (
            <Box className="p-4" sx={{ pt: `${NAVIGATION_BAR_HEIGHT}px` }}>
                <Typography variant="h5" color="error">
                    Error: No se pudo cargar el perfil del usuario o no está autenticado.
                </Typography>
                <Button onClick={() => navigate("/login")} variant="contained" sx={{ mt: 2 }}>
                    Ir a Acceso
                </Button>
            </Box>
        );
    }

    const profileUrl = getProfileUrl(user.profileImageUrl);

    return (
        <Box 
            className="flex flex-col items-center min-h-screen bg-gray-50 p-4"
            sx={{ pt: `${NAVIGATION_BAR_HEIGHT + 20}px` }}
        >
            <Paper 
                elevation={6} 
                className="w-full max-w-md p-6 sm:p-8 rounded-xl shadow-2xl transition-shadow duration-300 hover:shadow-xl"
            >
                <Box className="flex flex-col items-center mb-6">
                    <Avatar 
                        alt={user.name} 
                        src={profileUrl || undefined}
                        sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                    >
                        {!profileUrl && (user.name ? user.name[0] : <PersonIcon sx={{ fontSize: 60 }} />)}
                    </Avatar>
                    <Typography variant="h4" component="h1" className="text-center font-semibold text-gray-800">
                        {user.name || "Usuario Desconocido"}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="text-center mt-1">
                        {user.email}
                    </Typography>
                </Box>

                <Box className="space-y-4">
                    {/* Detalles del Perfil (Simulados) */}
                    <DetailRow label="ID de Usuario" value={user.id || "N/A"} />
                    <DetailRow label="Teléfono" value={user.phone || "No proporcionado"} />
                    <DetailRow label="Fecha de Registro" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"} />
                </Box>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    className="w-full mt-6 transition transform hover:scale-[1.01]"
                >
                    Cerrar Sesión
                </Button>

                <Typography variant="caption" className="block text-center mt-4 text-gray-500">
                    Esta es una vista previa de su información de perfil.
                </Typography>

            </Paper>
        </Box>
    );
}

// Componente auxiliar para mostrar detalles en filas
const DetailRow = ({ label, value }) => (
    <Box className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-inner">
        <Typography variant="body2" className="font-medium text-gray-600">
            {label}:
        </Typography>
        <Typography variant="body1" className="font-mono text-gray-800 break-all ml-4">
            {value}
        </Typography>
    </Box>
);
