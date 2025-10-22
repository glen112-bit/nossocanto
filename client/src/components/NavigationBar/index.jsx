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
import LogoutIcon from '@mui/icons-material/Logout'; // Ícone para Logout
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper'; 
import { AuthContext } from '../../context/AuthContext'

// URL externa para mayor claridad
const AIRBNB_URL = "https://www.airbnb.com.br/rooms/1337549417158200548?location=Centro%2C%20São%20Paulo&...";
const SERVER_BASE_URL = 'http://localhost:3000'; 

// Altura de la barra de navegación (56px por defecto en Material-UI)
// Úsalo como padding-top en tu componente principal para evitar solapamiento.
const NAVIGATION_BAR_HEIGHT = 56;

export default function NavigationBar() {

    const auth = React.useContext(AuthContext);
    // Obtém user, isAuthenticated e logout do AuthContext
    const { user, isAuthenticated, logout } = auth; 
    
    // Você não precisa de um estado 'user' local se estiver usando o Context
    // const [user, setUser] = React.useState(null); 
    const [loading, setLoading] = React.useState(false); // Mudado para false e removida a lógica de fetch local

    const navigate = useNavigate()
    const handleLogout = () => {
        logout();
        navigate('/')
    };

    // Removendo a função fetchCurrentUser e o useEffect relacionado, pois a lógica de autenticação
    // e re-hidratação deve estar totalmente contida no AuthProvider (AuthContext.jsx).
    
    // React.useEffect(() => {
    //     fetchCurrentUser();
    // }, [isAuthenticated]);

    // Función auxiliar para construir la URL de la imagen de perfil
    // A propriedade para avatar do Google/local é 'avatar' (não 'profileImageUrl')
    const getProfileUrl = (path) => {
        if (!path) return null;
        // Se for um caminho relativo (upload local), constrói o URL completo.
        // Se for um URL absoluto (Google), o 'path' já será o URL completo.
        return path.startsWith('http') || path.startsWith('data:') 
            ? path 
            : `${SERVER_BASE_URL}/${path.replace(/\\/g, '/')}`;
    };

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
        // Se estivermos em /login, /register, ou /profile, deselecionamos todos os botões principais
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

    // Renderiza la parte de Acceso/Perfil
    const UserProfileContent = () => {
        // Se o user está null (deslogado)
        if (!user) {
            // Determinamos se o botão ativo deve ser Login ou Register
            const isLoginPage = pathname.toLowerCase() === '/login';
            const isRegisterPage = pathname.toLowerCase() === '/register';

            return (
                <>
                    {/* Botão de LOGIN */}
                    <BottomNavigationAction 
                        label="Login" 
                        icon={<VpnKeyIcon />} 
                        onClick={() => {setValue(-1); navigate("/login");}} 
                        sx={{ minWidth: 'auto', p: 0.5 }}
                        showLabel
                        value={isLoginPage ? 99 : undefined} // Ativa se estiver na rota /login
                    />
                     {/* Botão de REGISTER */}
                    <BottomNavigationAction 
                        label="Registro" 
                        icon={<AccountCircleIcon />} 
                        onClick={() => {setValue(-1); navigate("/register");}}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                        showLabel
                        value={isRegisterPage ? 99 : undefined} // Ativa se estiver na rota /register
                    /> 
                </>
            );
        }

        // Caso: Usuário autenticado -> Mostrar Perfil (Avatar) e Logout
        const profileUrl = getProfileUrl(user.avatar); // USAR user.avatar
        const isActive = pathname.toLowerCase() === '/profile';

        return (
            <>
                {/* AÇÃO DE PERFIL: Muestra el Avatar y el nombre (o "Perfil") */}
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
                            {/* Fallback para a primeira letra ou ícono de Persona */}
                            {!profileUrl && (user.name ? user.name[0] : <PersonIcon />)}
                        </Avatar>
                    }
                    sx={{ minWidth: 'auto', p: 0.5 }}
                    value={isActive ? 99 : undefined}
                />

                {/* AÇÃO DE LOGOUT (Botão separado) */}
                <BottomNavigationAction
                    label="Sair"
                    icon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                    showLabel
                />
            </>
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
                    {/* 1. Regras */}
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
