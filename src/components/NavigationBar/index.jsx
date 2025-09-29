import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import DnsIcon from '@mui/icons-material/Dns';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper'; // Adicionado para dar elevação
import './style.css'

export default function NavigationBar() {

    const navigate = useNavigate()
    const [value, setValue] = React.useState(0);

    // Função de tratamento que decide entre navegação interna ou externa
    const handleChange = (event, newValue) => {
        setValue(newValue);
        
        // Mapeia os índices para as rotas internas, exceto o último (Airbnb)
        switch(newValue) {
            case 0: navigate("/"); break;
            case 1: navigate("/rules"); break;
            case 2: navigate("/places"); break;
            case 3: navigate("/instalations"); break;
            case 4: 
                // Ação externa: não usa navigate, abre em nova aba
                window.open("https://www.airbnb.com.br/rooms/1337549417158200548?location=Centro%2C%20São%20Paulo&search_mode=regular_search&source_impression_id=p3_1741601376_P3BVta8IfPNE5qMH&previous_page_section_name=1001&federated_search_id=ebcf265a-71a4-47c4-ba4f-6b1e7fadbe02&guests=1&adults=1", "_blank");
                break;
            default: navigate("/");
        }
    };

    return (
        // 1. Usa Paper e position: fixed para um design padrão de Bottom Navigation
        <Paper 
            sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                zIndex: 1000 // Garante que fique acima do resto do conteúdo
            }} 
            elevation={3} // Adiciona uma leve sombra para um visual mais bonito
        >
            <BottomNavigation 
                showLabels
                value={value}
                // 2. Simplifica o onChange para usar a nova função handleChange
                onChange={handleChange} 
            >
                {/* As ações agora usam o valor, o manipulador está no onChange do componente pai */}
                <BottomNavigationAction label="Home" icon={<HomeIcon />}/> 

                <BottomNavigationAction label="Regras" icon={<AssignmentLateIcon />}/> 
                <BottomNavigationAction label="Lugares" icon={<MapIcon/>}/>
                <BottomNavigationAction label="Instalações" icon={<DnsIcon />}/>
                
                {/* Para o link externo, usamos um design ligeiramente diferente para indicar que é externo */}
                <BottomNavigationAction 
                    label="AirBnb" 
                    icon={<TravelExploreIcon />}
                    // O valor 4 será tratado na função handleChange para abrir uma nova aba
                />
            </BottomNavigation>
        </Paper>
    );
}
