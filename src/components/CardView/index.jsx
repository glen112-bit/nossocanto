import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import "yet-another-react-lightbox/styles.css";

export const CardView = ({title, description, src, heigth, width}) => {

    return (
        <Card >
            <CardActionArea sx={{backgroundColor: 'grey'}}>
                {/*
                  */} 
                <CardMedia
                    component="img"
                    height={heigth}
                    width={width}
                    image={src}
                    alt={title}
                    sx={{border: '6px solid gray'}}
                />

            </CardActionArea>
            <CardContent sx={{ backgroundColor: 'gray' }}>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}

