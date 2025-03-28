import * as React from 'react';
import axios from 'axios'
import { ThemeProvider } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { 
    CardView,
    VideoView
} from '../../components'
import { theme } from './style.js'
import{ useState, useEffect } from 'react'
import Lightbox from "yet-another-react-lightbox";
import {
    Download,
    Fullscreen,
    Zoom,
} from 'yet-another-react-lightbox/plugins';
import "yet-another-react-lightbox/styles.css";
import './style.css'

export default function WovenImageList() {
    const [myData, setMyData] = useState([]);
    const [myVideo, setMyVideo] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios.get('../../assets/data.json')
            .then(res => {
                // console.log(res);
                setMyData(res.data.images)
                setMyVideo(res.data.videos)
            })

    },[]);

    console.log(myVideo);
    const Src = () => {
        setOpen(true)

    }

    return (

        <>
            <ThemeProvider theme = {theme}>

                <h2 className = "subtitle">NossaCasa</h2>
                <Grid sx={{width:'70vw', padding:'auto', display: 'flex', justifyContent:'center' }}
                    container spacing={3}   
                >
                    {myData.map((item, id) => (
                        <>
                            <button onClick={() => Src()}>
                                <CardView 
                                    src={item.src} 
                                    title={item.name} 
                                    description={item.description} 
                                    key={id}
                                    data-attribute={"SRL"}
                                    heigth={460}
                                    width={350}
                                />
                            </button> 
                        </>
                    ))
                    }
                    <Lightbox
                        plugins={[ Download, Fullscreen, Zoom]}

                        open={open}
                        close={() => setOpen(false)}
                        slides={myData}
                    />

                </Grid>
            </ThemeProvider>
            {
                myVideo.map((item) => (<VideoView data={item}/>))
            }           
        </>    
    );
}
