import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box'; // ⚠️ Importado para o Overlay
import { styled } from '@mui/material/styles'; // ⚠️ Importado para o efeito de hover
import "yet-another-react-lightbox/styles.css";
import PropTypes from 'prop-types'; 

// 1. Componente Estilizado (StyLED) para o efeito de zoom no hover
const CustomCard = styled(Card)(({ theme }) => ({
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        // Leve aumento no tamanho (zoom sutil)
        transform: 'scale(1.02)', 
        // Aumenta a sombra para dar profundidade
        boxShadow: theme.shadows[10], 
    },
}));

export const CardView = ({title, description, src, height, width, onClick}) => {

    return (
        // Substituimos Card por CustomCard para aplicar o efeito de hover
        <CustomCard sx={{ 
            height: height, 
            width: width, 
            maxWidth: "100%", 
            display: 'flex', 
            flexDirection: 'column',
            // Adicionamos um raio nas bordas para suavizar o design
            borderRadius: 2, 
        }}>
            <CardActionArea
                onClick={onClick}
                sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    position: 'relative',
                }}>
                
                {/* 2. CardMedia (A Imagem) */}
                <CardMedia
                    component="img"
                    image={src} 
                    alt={title}
                    sx={{
                        height:"100%",
                        width: "100%", 
                        objectFit: "cover",
                        position: 'absolute',
                        top: 0,
                        left:0,
                        minHeight: '1px',
                    }}
                />
                
                {/* 3. ImageOverlay (Degradê preto sutil na parte inferior) */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50%', // Define a área do degradê (metade inferior)
                        background: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0))',
                        zIndex: 1, // Garante que o overlay fique acima da imagem
                    }}
                />

                {/* 4. CardContent (Conteúdo sobre a imagem, para título/descrição) */}
                {/* Posicionamos o conteúdo sobre a imagem, na parte inferior, para um visual de revista */}
                <CardContent 
                    sx={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2, // Fica acima do overlay
                        padding: 2, // Espaçamento interno
                    }}
                >
                    <Typography 
                        gutterBottom 
                        variant="h6" // Título um pouco menor e mais nítido
                        component="div"
                        sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }} // Texto branco com sombra para destaque
                    >
                        {title}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: 'rgba(255, 255, 255, 0.8)', // Cor clara para descrição
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                            // Oculta a descrição em telas pequenas para economizar espaço
                            display: { xs: 'none', sm: 'block' } 
                        }}
                    >
                        {description}
                    </Typography>
                </CardContent>

            </CardActionArea>
            
            {/* 5. Se você ainda precisar de um rodapé separado abaixo da imagem: */}
            {/* <CardContent sx={{ backgroundColor: 'background.paper', paddingTop: 1, paddingBottom: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent> */}
        </CustomCard>
    );
}

CardView.propTypes = {
    title: PropTypes.string.isRequired, 
    description: PropTypes.string, 
    src: PropTypes.string.isRequired, 
    height: PropTypes.string.isRequired, 
    width: PropTypes.string, 
    onClick: PropTypes.func, 
};
