import React from 'react';
import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker,
    // withScriptsjs, withGoogleMap
} from '@react-google-maps/api'
import './style.css';



export const MapView = ({width, heigth, lat, lng, text, className}) => {
    // const [office, setOffice] = useState();
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBkZr2Nl6Y4UIbhmpYU1xATNQhKh_4bG6E",
    })
const containerStyle = {
    width: width,
    height: heigth,
}

const center = {
    lat: Number(lat),
    lng: Number(lng),
}

    
    return(
        <>
            <section className= "mapBorder">
                <h2>Sao Paulo Centro</h2>
                <section className = "mapview">
                    {
                        isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={13.5}
                                // onLoad={onLoad}
                                // onUnmount={onUnmount}
                            >
                                {/* Child components, such as markers, info windows, etc. */}
                                <></>
                                <Marker 
                                    position={center}
                                    options={{
                                        label:{
                                            text: text,
                                            className: className 
                                        }
                                    }}
                                />
                            </GoogleMap>
                        ) : (
                            <></>
                        )
                    }
                </section>

            </section>

        </>
    )
}

// export default withScriptsjs {
// withGoogleMap{
//
// }
// }
