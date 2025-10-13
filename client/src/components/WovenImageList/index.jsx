import * as React from 'react';
import axios from 'axios'
import { ThemeProvider , createTheme, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { getImageUrl } from '../../utils/image-utils.js'

// const imageModules = import.meta.glob('../../assets/images/*.{png,jpg,jpeg,webp}', { eager: true });

import { 
    CardView,
    VideoView
} from '../../components'
// import { theme } from './style.js'

const theme = createTheme({ cssVariables: true });
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
    const [images, setImages] = useState([]);
    const [myVideo, setMyVideo] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Carrega os dados (myData.json)
                const res = await axios.get('../../myData.json');

                const resolvedImages = res.data.images
                .map(item => ({ 
                    ...item, 
                    src: item.src 
                }))
                .filter(item => item.src)
                .map(item => {
                    // 2. Extrai o nome do arquivo
                    const rawFilename = item.src.split('/').pop().split('\\').pop().trim();
                    // 3. CRÍTICO: Caminho ABSOLUTO
                    const publicSrc = `/images/imags/${rawFilename}`;
                    return {
                        ...item, 
                        src: publicSrc
                    };
                });
                const resolvedVideos = res.data.videos
                .filter(item => item && item.src)
                .map(item => {
                    const rawFileName = item.src.split('/').pop().split('\\').pop().trim();
                    const publicSrc = `/images/imags/${rawFileName}`;
                    return { ...item, src: publicSrc }
                })

                setImages(resolvedImages.filter(item => item !== null));

                setMyVideo(resolvedVideos);

                setMyData(res.data);
            } catch (error) {
                console.error("Error fetching data or loading assets:", error);
            }
        };   fetchData();
          }, []);
        console.log(myVideo)
        // console.log(myData)

        const Src = (index) => {
            setOpen(true)
            setCurrentSlideIndex(index)
        }

        return (

            <>
                <ThemeProvider theme={theme}>              
                    <Box 
                        sx={{ 
                            width: '100%', 
                            textAlign: 'center', 
                            py: 4, 
                            // Fundo: Off-White
                            //backgroundColor: '#f7f7f7',
                            // ✅ Arredondar as esquinas
                            borderRadius: 2,
                            // ✅ Sombra elegante e sutil para a borda
                            boxShadow: 4, // Usa a sombra padrão do MUI (elevation 4)
                            mb: 6,
                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Transição suave
                                '&:hover': {
                                    transform: 'scale(1.05)', // Aumenta 5% ao passar o mouse
                                    boxShadow: 6, // Sombra mais pronunciada ao passar o mouse
                            },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'inline-block', // Crucial para que o hover afete o tamanho real do box
                                    cursor: 'pointer', // Indica que é interativo
                                    // Propriedades do "card" do título:
                                    backgroundColor: 'white', 
                                    padding: '10px 20px', 
                                    borderRadius: '8px', 
                                    boxShadow: 2, 
                                }}
                            >
                                <Typography 
                                    variant="h3" 
                                    component="h1" 
                                    fontWeight={400} // Fonte extra-fina e delicada
                                    color="text.primary"
                                    sx={{ 
                                        fontStyle: 'italic', 
                                        letterSpacing: 3, // Aumento sutil no espaçamento entre letras
                                        textTransform: 'uppercase', // Para um toque de elegância sutil
                                        textShadow: '4px 4px 6px rgba(0, 0, 0, 0.1)'
                                    }} 
                                >
                                    NossaCasa
                                </Typography>
                                <Typography
                                    variant="body1" 
                                    component="p" 
                                    color="#9e9e9e" 
                                    sx={{ mt: 1, letterSpacing: 1 }}>
                                    Um Refúgio de Paz e Serenidade.
                                </Typography>
                            </Box>
                        </Box> 
                        <Grid sx={{width:'70vw', padding:'auto', display: 'flex', justifyContent:'center' }}
                            container spacing={3}   
                        >
                            {

                                images.map((item, id) => (
                                    // <Grid item key={item.id || id} xs={12} sm={6} md={4} lg={3}>
                                        <Grid item xs={12} sm={6} md={4} sx={{ 
                                            // Garante que o Grid item tenha a altura exata que o Card espera
                                            height: '460px', 
                                            display: 'flex', // Adicione flex para garantir que o Card preencha o espaço
                                            }}>
                                            <CardView 
                                                title={item.name}
                                                src={item.src}
                                                // src={getImageUrl(item.src)}
                                                // src={console.log(getImageUrl(item.src)) || item.src}
                                                loading= {"lazy"}
                                                description={item.description}
                                                key={item.id}
                                                height="100%"
                                                width="350px"
                                                // onClick={() => openLightbox(index)}
                                            onClick={() => Src(id)}
                                            alt={item.name}
                                        />

                                    </Grid>
                            ))
                        }
                    </Grid>
                </ThemeProvider> 
                <Grid style={{padding: '4vh'}} >
                    {
                        myVideo.map((item, id) => (
                            <Grid> 
                                <VideoView 
                                    // data={{...item, src: getImageUrl(item.src)}}
                                    data={ item}
                                    key={id}
                                />
                            </Grid>

                        ))
                    } 
                </Grid>
                <Lightbox
                    plugins={[ Download, Fullscreen, Zoom]}
                    styles={{
                        // 1. Asegura que el contenedor del slide es FLEX para dimensionar el contenido
                        container: { 
                            zIndex: 9999999, // Lo pone por encima de todo
                    },
                    // 2. FUERZA la visualización del contenido de la imagen
                    slide: {
                        display: 'flex', // El valor por defecto, lo reforzamos.
                        alignItems: 'center',
                        justifyContent: 'center',
                        // Añade un borde temporal para ver si el SLIDE tiene tamaño
                        // border: '5px solid red' // Descomenta temporalmente para depurar
                    },
                    // 3. FUERZA el ajuste de la imagen dentro del slide
                    slideImage: {
                        objectFit: 'contain', 
                        maxWidth: '100%',
                        maxHeight: '100%',
                    }
                    }} 
                    className="lightbox-priority-fix"
                                          open={open}
                                            close={() => setOpen(false)}
                    index={currentSlideIndex}
                                            slides={images.map(item => ({ 
                        // Map over images and apply getImageUrl to the src property
                        src: item.src,
                        // Include other properties Lightbox might use (optional)
                        title: item.name 
                    }))}
                />


            </>    
        );
}
