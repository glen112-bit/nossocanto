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
import { theme } from './style.js'
import{ useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
// import {Unpublished} from '@mui/icons-material';



export default function WovenImageList() {
    // const [imagenes, setImagenes] = useState();
    // const uuid = require('uuid')
    // console.log(uuidv4)

    // useEffect(() => {
        // const myFiles = axios.get('../../assets/images/*')
        // setImagenes()
        // console.log(myFiles)
    // },[]);
    // const habndleImage = (e) => {
        // console.log(e.target.files)
        // setImagenes(e.target.files[0])
    // }
    let Images = data.images


    const handleClick = (e) => {
        console.log('click');
        e.preventDefault()
    };
    return (
        <ThemeProvider theme = {theme}>
            <Grid sx={{width:'70vw', padding:'auto', display: 'flex', justifyContent:'center' }}
                container spacing={3}   
            >

                {Images.map((item, id) => (
                    <ImageListItem
                        id={uuidv4()}
                        sx={{ width: {
                            mobile: 200,
                                tablet:200,
                                desktop:300,
                        } }}
                        key={id}
                    >
                        <img onClick={handleClick}
                            id={uuidv4()}
                            key={id}
                            srcSet={`${item.src}?w=161&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.src}?w=161&fit=crop&auto=format`}
                            alt={item.name}
                            // id={v4}
                            loading="lazy"
                        />
                        <ImageListItemBar position="below" title={item.name} />
                    </ImageListItem>
                        ))
                }
            </Grid>
        </ThemeProvider>

    );
}

