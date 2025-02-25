import React from "react"
import "./style.css"
import Button from '@mui/material/Button';
import NavigationBar from "../NavigationBar"

 const Header = ({text}) => {
    return(
        <div className="header">
            <Button href="https://es-l.airbnb.com/rooms/1337549417158200548?viralityEntryPoint=1&unique_share_id=D899166B-2D8D-401E-82ED-734C093C2473&slcid=9ad3bcc401674c23a13997d00c15f112&s=76&feature=share&adults=1&channel=native&slug=IjdyFVXj&source_impression_id=p3_1740006591_P3QUqKuL-CTnXyzi&modal=PHOTO_TOUR_SCROLLABLE" variant="contained" className="text">{text}</Button>
            <NavigationBar/>
        </div>
    )
}
export default Header
