import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import DnsIcon from '@mui/icons-material/Dns';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import {useNavigate} from 'react-router-dom';

export default function NavigationBar() {

  const navigate = useNavigate()
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <BottomNavigation 
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue); }}
      >
        <BottomNavigationAction onClick={()=> navigate("/")} label="NossoCanto" icon={<HomeIcon />} sx={{ width: 500 }}/> 
        <BottomNavigationAction onClick={()=> navigate("/rules")} label="Regras" icon={<AssignmentLateIcon />} sx={{ width: 500 }}/> 
        <BottomNavigationAction onClick={()=> navigate("/places")}label="Lugares" icon={<MapIcon/>} sx={{ width: 500 }}/>
        <BottomNavigationAction onClick={()=> navigate("/instalations")}label="Instalacoes" icon={<DnsIcon />} sx={{ width: 500 }}/>
      </BottomNavigation>
    </Box>
  );
}
