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
      <Box sx={{ width: "100%", height: "6vh", backgroundColor: 'white', alignContent: 'center' }}>
      <BottomNavigation 
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue); }}
      >
        <BottomNavigationAction onClick={()=> navigate("/")} label="NossoCanto" icon={<HomeIcon />} sx={{ width: 400 }}/> 
        <BottomNavigationAction onClick={()=> navigate("/rules")} label="Regras" icon={<AssignmentLateIcon />} sx={{ width: 400 }}/> 
        <BottomNavigationAction onClick={()=> navigate("/places")}label="Lugares" icon={<MapIcon/>} sx={{ width: 400 }}/>
        <BottomNavigationAction onClick={()=> navigate("/instalations")}label="Instalacoes" icon={<DnsIcon />} sx={{ width: 400 }}/>
         <BottomNavigationAction className= "air"  href='https://www.airbnb.com.br/rooms/1337549417158200548?guests=1&adults=1&s=67&unique_share_id=f0301938-bb01-4fc7-8fae-4b1e87863f61&fbclid=IwY2xjawI79WFleHRuA2FlbQIxMQABHYFEpELpj_mbKBi_Cqz4X5q1ta1yDUIVJMaQaDxjBHVUN4Lzt0RnXmG9nQ_aem_1uHdT1qmmJraxqD4YyXtWA&source_impression_id=p3_1741624850_P3bxx293Hdhn-8Qn' label="AirBnb" icon={<TravelExploreIcon />} />
      </BottomNavigation>
    </Box>
  );
}
