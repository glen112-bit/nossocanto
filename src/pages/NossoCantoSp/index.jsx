import * as React from "react"
import {MapView} from '../../components'
import WovenImageList from '../../components/WovenImageList'
import { Item } from '../../components/Item'
// import { useState } from "react";
// import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
// import { styled } from '@mui/material/styles';
import "./style.css"

export default function NossoCantoSp () {


    return(

        <section className = "borderCanto">
            <section className= "nossocantosp">
                <h1>
                    NossoCantoSp
                </h1>

                <MapView 
                    width='100vw' 
                    heigth='450px' 
                    lat='-23.5487055' 
                    lng='-46.6438873' 
                    text="NossoCanto" 
                    className='mapMarcker' 
                />
                <div className="images">
                    <Stack>
                        <Item>
                            <WovenImageList />
                        </Item>
                    </Stack>
                </div>

            </section>

        </section>    

    )
}

