import * as React from 'react';
// import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';

export const VideoView = ({data}) => {
  // const theme = useTheme();

  // Se o vídeo não for mp4, troque 'video/mp4' por 'video/quicktime' (para MOV) ou outro tipo MIME.
  const videoMimeType = "video/quicktime"; 

  // URL absoluta do vídeo (resolvida no componente pai)
  const videoSrc = data.src;
  return (
    <Card component="li" sx={{height: 600, minWidth: 300, flexGrow: 1 }}>
      <CardCover>
        <video
          controls
          autoPlay
          loop
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source
            src={videoSrc}
            type={videoMimeType}
          />
        </video>
      </CardCover 

      >
      <CardContent gutterBottom  component="div"
        sx={{ 
          // Coloque o texto no rodapé do Card, sobre o vídeo
          mt: 'auto', 
          backgroundColor: 'rgba(0, 0, 0, 0.4)', 
          zIndex: 1 
        }}
      >
        <Typography
          // level="body-lg"
          textColor="#fff"
          sx={{ position: 'fixed', fontWeight: 'lg', mt: { xs: 12, sm: 18 } }}
        >
          {data.name}
        </Typography>
      </CardContent>
    </Card>
  );
}
