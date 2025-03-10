import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Grid from '@mui/material/Grid2'
// import Masonry from '@mui/lab/Masonry';
import data from '../../assets/data.json'
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles'
import { green } from '@mui/material/colors'
import { Item } from '../../components/Item'
import { theme } from './style.js'

// const Responsive = styled('div')(({theme}) => ({
// [theme.breakpoints.down('mobile')]:{
// cols: 1
//
// },
// [theme.breakpoints.down('tablet')]:{
// cols:3
// }
//
// }))

export default function WovenImageList() {
    const [w, setW] = useState(window.innerWidth);
    let Images = data.images

    useEffect(() => {
        const handleResize = () => {
            setW(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize )
        }
    },[]);
    // const theme = useTheme();
    // const matches = useMediaQuery('(min-width:600px)');

    const handleClick = (e) => {
        console.log('click');
        e.preventDefault()
    };
    return (
        <ThemeProvider theme = {theme}>
            {/*  <div>{w} px</div>*/}
            <Grid sx={{width:'70vw', padding:'auto', display: 'flex', justifyContent:'center' }}
             container spacing={3}   
            >

                    {Images.map((item) => (
                        <ImageListItem
                            sx={{ width: {
                        mobile: 200,
                        tablet:200,
                        desktop:300,
                } }}
                            key={item.name}>
                               <img onClick={handleClick}
                                srcSet={`${item.src}?w=161&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.src}?w=161&fit=crop&auto=format`}
                                alt={item.name}
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

