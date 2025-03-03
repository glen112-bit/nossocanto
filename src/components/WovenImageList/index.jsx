import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import data from '../../assets/data.json'

export default function WovenImageList() {
    let Images = data.images

  return (
    <ImageList sx={{ width: 900, height: 750 }} variant="woven" cols={3} gap={8}>
        {Images.map((item) => (
        <ImageListItem >
          <img
            srcSet={`${item.src}?w=161&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.src}?w=161&fit=crop&auto=format`}
            alt={item.name}
            loading="lazy"
          />
        </ImageListItem>
     )
        )
          }
    </ImageList>
  );
}

