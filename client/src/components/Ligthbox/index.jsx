import React from 'react'
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export const Ligthbox = ({src, open, setOpen}) => {
    return(
    <>
        <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          { src: src },
        ]}
      />
    </>
   )
}
