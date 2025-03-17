import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export const CardView = ({title, description, src, heigth, width}) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea sx={{borderRadius: '25'}}>
                <CardMedia
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
