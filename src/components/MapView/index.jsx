import React from 'react';
import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker,
    // withScriptsjs, withGoogleMap
} from '@react-google-maps/api'
import './style.css';

const containerStyle = {
    width: '100vw',
    height: '500px',
}

const center = {
    lat: -23.5487055,
    lng: -46.6438873,
}

export const MapView = ({props}) => {
    const [office, setOffice] = useState();
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBkZr2Nl6Y4UIbhmpYU1xATNQhKh_4bG6E",
    })
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
                                <Marker position={center}/>
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
