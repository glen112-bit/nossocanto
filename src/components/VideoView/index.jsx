import * as React from 'react';
// import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';

export const VideoView = ({data}) => {
  // const theme = useTheme();

  return (
      <Card component="li" sx={{height: 600, minWidth: 300, flexGrow: 1 }}>
        <CardCover>
          <video
            autoPlay
            loop
            muted
            poster={data.src}
          >
            <source
              src={data.src}
              type="video/MOV"
            />
          </video>
        </CardCover>
        <CardContent gutterBottom  component="div">
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
