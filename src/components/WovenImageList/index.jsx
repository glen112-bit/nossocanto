import * as React from 'react';
import axios from 'axios'
// import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material';
// import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Grid from '@mui/material/Grid2'
// import Masonry from '@mui/lab/Masonry';
import data from '../../assets/data.json'
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { CardView } from '../../components'
import { theme } from './style.js'
import{ useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
// import {Unpublished} from '@mui/icons-material';



export default function WovenImageList() {
    // const [imagenes, setImagenes] = useState();
    const [myData, setMyData] = useState([]);
    // const uuid = require('uuid')
    // console.log(uuidv4)

    useEffect(() => {
        axios.get('../../assets/data.json')
            .then(res => {
                setMyData(res.data.images)
            })
    },[]);
    // let Images = data.images


    const handleClick = (e) => {
        console.log('click');
        e.preventDefault()
    };
    return (
        <ThemeProvider theme = {theme}>
                <h2>NossaCasa</h2>
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

