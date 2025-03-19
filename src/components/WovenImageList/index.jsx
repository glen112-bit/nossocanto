import * as React from 'react';
import axios from 'axios'
import { ThemeProvider } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { CardView } from '../../components'
import { theme } from './style.js'
import{ useState, useEffect } from 'react'
import './style.css'



export default function WovenImageList() {
    const [myData, setMyData] = useState([]);

    useEffect(() => {
        axios.get('../../assets/data.json')
            .then(res => {
                setMyData(res.data.images)
            })
    },[]);


    // const handleClick = (e) => {
        // console.log('click');
        // e.preventDefault()
    // };
    return (
        <ThemeProvider theme = {theme}>
                <h2 className = "subtitle">NossaCasa</h2>
            <Grid sx={{width:'70vw', padding:'auto', display: 'flex', justifyContent:'center' }}
                container spacing={3}   
            >
                {myData.map((item, id) => (
                    <CardView 
                        src={item.src} 
                        title={item.name} 
                        description={item.description} 
                        key={id}
                        heigth={460}
                        width={350}
                    />

                ))
                }
            </Grid>
        </ThemeProvider>

    );
}

