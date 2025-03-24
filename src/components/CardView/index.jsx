import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// import { useState } from 'react'

// import ImageViewer from 'react-simple-image-viewer';


export const CardView = ({title, description, src, heigth, width}) => {
// const [open, setOpen] = useState(false);

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea sx={{borderRadius: '25'}}>
                {/*
      <button type="button" onClick={() => setOpen(true)}>
        Open Lightbox
      </button>
                */} 
                <CardMedia
                    // onClick={ () => openImageViewer(index) }
                    component="img"
                    height={heigth}
                    width={width}
                    image={src}
                    alt={title}
                    sx={{border: '6px solid gray'}}
                />
                <CardContent sx={{ backgroundColor: 'gray' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

