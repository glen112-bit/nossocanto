import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import "yet-another-react-lightbox/styles.css";
import PropTypes from 'prop-types'; 

export const CardView = ({title, description, src, height, width, onClick}) => {

    return (
        // 1. Card: Define o tamanho total e o layout vertical (display: flex + flexDirection: column)
        <Card sx={{ 
            height: height, 
            width: width, 
            maxWidth: "100%", 
            display: 'flex', 
            flexDirection: 'column' 
        }}>
            <CardActionArea
                onClick={onClick}
                sx={{
                    // 2. CardActionArea: Precisa ser um flex container para o flexGrow funcionar
                    // display: 'flex',
                    // flexDirection: 'column',
                    // CRÍTICO: Permite que ocupe todo o espaço vertical restante
                    flexGrow: 1,
                    // CRÍTICO: Previne o colapso de altura (height: 0)
                    minHeight: 0,
                    position: 'relative',
                }}>
                <CardMedia
                    component="img"
                    image={src} // URL válida, conforme status 304
                    alt={title}
                    sx={{
                        // 3. CardMedia: OBRIGA a preencher 100% da área de ação
                        // flexFrow: 1,
                        height:"100%",
                        width: "100%", 
                        objectFit: "cover",
                        position: 'absolute',
                        top: 0,
                        left:0,
                        minHeight: '1px',
                        // Borda para depuração final (opcional):
                        // border: '4px solid red', 
                    }}
                />

            </CardActionArea>
            <CardContent sx={{ backgroundColor: 'transparent' }}>
                <Typography  gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}
CardView.propTypes = {
    // String - Usada no Typography
    title: PropTypes.string.isRequired, 
    // String - Usada no Typography
    description: PropTypes.string, 
    // String - URL da imagem (passada do WovenImageList)
    src: PropTypes.string.isRequired, 
    // String - Altura do Card (passada como "100%" ou "460px")
    height: PropTypes.string.isRequired, 
    // String - Largura do Card (passada como "350px")
    width: PropTypes.string, 
    // Função - Handler de clique para abrir o Lightbox
    onClick: PropTypes.func, 
};
