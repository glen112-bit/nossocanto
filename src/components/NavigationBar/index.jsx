import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import DnsIcon from '@mui/icons-material/Dns';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import {useNavigate} from 'react-router-dom';
import './style.css'

export default function NavigationBar() {

  const navigate = useNavigate()
  const [value, setValue] = React.useState(0);

  return (
      <Box sx={{ width: "100%", height: "6vh", backgroundColor: 'white', alignContent: 'center', position: "static" }}>
      <BottomNavigation 
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue); }}
      >
        <BottomNavigationAction onClick={()=> navigate("/")} label="NossoCanto" icon={<HomeIcon />}/> 
        <BottomNavigationAction onClick={()=> navigate("/rules")} label="Regras" icon={<AssignmentLateIcon />}/> 
        <BottomNavigationAction onClick={()=> navigate("/places")}label="Lugares" icon={<MapIcon/>}/>
        <BottomNavigationAction onClick={()=> navigate("/instalations")}label="Instalacoes" icon={<DnsIcon />}/>
        <BottomNavigationAction className="air" href="https://www.airbnb.com.br/rooms/1337549417158200548?location=Centro%2C%20São%20Paulo&search_mode=regular_search&source_impression_id=p3_1741601376_P3BVta8IfPNE5qMH&previous_page_section_name=1001&federated_search_id=ebcf265a-71a4-47c4-ba4f-6b1e7fadbe02&guests=1&adults=1" label="AirBnb" icon={<TravelExploreIcon />}/>
      </BottomNavigation>
    </Box>
  );
}
