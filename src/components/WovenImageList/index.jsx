import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
// import Masonry from '@mui/lab/Masonry';
import data from '../../assets/data.json'
import ImageListItemBar from '@mui/material/ImageListItemBar';

import './style.css'

export default function WovenImageList() {
    let Images = data.images

    const handleClick = (e) => {
        console.log('click');
        e.preventDefault()
    };
    return (
        <div className = "imageBorder">

            <ImageList 
                sx={{ width: 900, height: 750 }} variant="woven" cols={3} gap={8}>
                {Images.map((item) => (
                       <ImageListItem >
                           <img onClick={handleClick}
                            srcSet={`${item.src}?w=161&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.src}?w=161&fit=crop&auto=format`}
                            alt={item.name}
                            loading="lazy"
                        />
                        <ImageListItemBar position="below" title={item.name} />
                    </ImageListItem>
                ))
                }
                   
            </ImageList>

        </div>
    );
}

