import * as React from "react"
import MapView from '../../components/map'
import WovenImageList from '../../components/WovenImageList'
import { useState } from "react";
// import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
// import { styled } from '@mui/material/styles';
import "./style.css"


export default function NossoCantoSp () {
    const [images, setImages] = useState([]);


    return(

        <section className = "borderCanto">
            <section className= "nossocantosp">
                <h1>NossoCantoSp</h1>
                <MapView/>
                <Stack>
                    <div className="images">
                        <WovenImageList />
                    </div>
                </Stack>

            </section>

        </section>    

    )
}

