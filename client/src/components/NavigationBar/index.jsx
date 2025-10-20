
import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import DnsIcon from '@mui/icons-material/Dns';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import Avatar from '@mui/material/Avatar';
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // Ícono para Login
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Ícono para Register
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper'; 

// URL externa para mayor claridad
const AIRBNB_URL = "https://www.airbnb.com.br/rooms/1337549417158200548?location=Centro%2C%20São%20Paulo&...";
const SERVER_BASE_URL = 'http://localhost:3000'; 

// Altura de la barra de navegación (56px por defecto en Material-UI)
// Úsalo como padding-top en tu componente principal para evitar solapamiento.
const NAVIGATION_BAR_HEIGHT = 56;

export default function NavigationBar() {
    // Estado temporal para simular el estado de autenticación (idealmente vía Context/Redux)
    const [user, setUser] = React.useState(null); 
    const [loading, setLoading] = React.useState(true);

    // Función de búsqueda (Simulación del 'useAuth')
    async function fetchCurrentUser() {
        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include', 
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                return data.user;
            } else {
                setUser(null);
                return null;
            }
        } catch (error) {
            console.error('Error al buscar usuario:', error);
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        fetchCurrentUser();
    }, []);

    // Función auxiliar para construir la URL de la imagen de perfil
    const getProfileUrl = (path) => {
        if (!path) return null;
        return `${SERVER_BASE_URL}/${path.replace(/\\/g, '/')}`;
    };

    const navigate = useNavigate();
    const { pathname } = window.location;

    // Mapeo de valores para la navegación activa (Solo para las rutas del BottomNavigation)
    const routeMap = React.useMemo(() => ({
        '/': 0,
        '/rules': 1,
        '/places': 2,
        '/instalations': 3,
    }), []);

    // Calcula el valor inicial basado solo en las rutas fijas (0-3)
    const initialValue = React.useMemo(() => {
        const currentPath = pathname.toLowerCase(); 
        return routeMap[currentPath] !== undefined ? routeMap[currentPath] : 0;
    }, [pathname, routeMap]);

    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
        // Si estamos en /login, /register, o /profile, deseleccionamos todos los botones principales
        if (['/login', '/register', '/profile'].includes(pathname.toLowerCase())) {
            setValue(-1); 
        }
    }, [initialValue, pathname]);

    // Función de tratamiento que decide entre navegación interna o externa
    const handleChange = (event, newValue) => {
        // Si el valor es 6 (Airbnb), no cambiamos el estado 'value' ni navegamos internamente
        if (newValue !== 6) {
            setValue(newValue);
        }

        switch(newValue) {
            case 0: navigate("/"); break;
            case 1: navigate("/rules"); break;
            case 2: navigate("/places"); break;
            case 3: navigate("/instalations"); break;
            case 6: // Airbnb (Link externo)
                window.open(AIRBNB_URL, "_blank");
                break;
            default: 
                // No navegar por defecto si no es una de las rutas definidas
                break;
        }
    };

    // Renderiza la parte de Acceso/Perfil (AHORA SIEMPRE FUERA DEL BottomNavigation PRINCIPAL)
    const UserProfileContent = () => {
        // Si está cargando, no muestra nada
        if (loading) {
            return null; 
        }

        // Caso: Usuario NO autenticado -> Mostrar Login y Register
        if (!user) {
            // Determinamos si el botón activo debe ser Login o Register
            const isLoginPage = pathname.toLowerCase() === '/login';
            const isRegisterPage = pathname.toLowerCase() === '/register';

            return (
                <>
                    {/* Botón de LOGIN */}
                    <BottomNavigationAction 
                        label="Login" 
                        icon={<VpnKeyIcon />} 
                        onClick={() => {setValue(-1); navigate("/login");}} // Deseleccionar principal
                        sx={{ minWidth: 'auto', p: 0.5 }}
                        showLabel
                        value={isLoginPage ? 99 : undefined} // Usamos un valor alto para activarlo
                    />
                    {/* Botón de REGISTER */}
                    <BottomNavigationAction 
                        label="Registro" 
                        icon={<AccountCircleIcon />} 
                        onClick={() => {setValue(-1); navigate("/register");}} // Deseleccionar principal
                        sx={{ minWidth: 'auto', p: 0.5 }}
                        showLabel
                        value={isRegisterPage ? 99 : undefined}
                    />
                </>
            );
        }

        // Caso: Usuario autenticado -> Mostrar Perfil (Avatar)
        const profileUrl = getProfileUrl(user.profileImageUrl);
        const isActive = pathname.toLowerCase() === '/profile';

        return (
            // Acción de Perfil: Muestra el primer nombre o "Perfil"
            <BottomNavigationAction
                label={user.name ? user.name.split(' ')[0] : "Perfil"}
                onClick={() => {setValue(-1); navigate("/profile");}} // Deseleccionar principal y navegar
                showLabel
                icon={
                    <Avatar 
                        alt={user.name} 
                        src={profileUrl || undefined} 
                        sx={{ 
                            width: 24, 
                            height: 24, 
                            cursor: 'pointer',
                            border: isActive ? '2px solid' : 'none',
                            borderColor: 'primary.main',
                            boxSizing: 'content-box'
                        }}
                    >
                        {/* Fallback para la primera letra o ícono de Persona */}
                        {!profileUrl && (user.name ? user.name[0] : <PersonIcon />)}
                    </Avatar>
                }
                sx={{ minWidth: 'auto', p: 0.5 }}
                value={isActive ? 99 : undefined}
            />
        );
    };


    return (
        // Contenedor que reserva el espacio del header para que el contenido principal no se solape
        <Box sx={{ height: `${NAVIGATION_BAR_HEIGHT}px` }}>
            <Paper 
                sx={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    height: `${NAVIGATION_BAR_HEIGHT}px`,
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: '0 8px'
                }} 
                elevation={3}
            >
                <BottomNavigation 
                    showLabels
                    value={value}
                    onChange={ handleChange }
                    sx={{ flexGrow: 1, minWidth: 0, height: 'auto', justifyContent: 'flex-start' }} 
                >
                    {/* 0. Home */}
                    <BottomNavigationAction label="Home" value={0} icon={<HomeIcon />}/> 
                    {/* 1. Reglas */}
                    <BottomNavigationAction label="Regras" value={1} icon={<AssignmentLateIcon />}/> 
                    {/* 2. Lugares */}
                    <BottomNavigationAction label="Lugares" value={2} icon={<MapIcon/>}/>
                    {/* 3. Instalaciones */}
                    <BottomNavigationAction label="Instalações" value={3} icon={<DnsIcon />}/>
                    
                    {/* 6. AirBnb (Link Externo) */}
                    <BottomNavigationAction 
                        label="AirBnb" 
                        icon={<TravelExploreIcon />}
                        value={6}
                    />
                </BottomNavigation>

                {/* Contenedor para el botón de Acesso/Perfil (Login/Register o Avatar) */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <UserProfileContent />
                </Box>
            </Paper>
        </Box>
    );
}

