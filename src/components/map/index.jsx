import React from 'react';
import { GoogleMap, useJsApiLoader, Marker,
    // withScriptsjs, withGoogleMap
} from '@react-google-maps/api'
import './style.css';

const containerStyle = {
    width: '60vw',
    height: '600px',
}

const center = {
    lat: -23.5487055,
    lng: -46.6438873,
}

const MapView = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBkZr2Nl6Y4UIbhmpYU1xATNQhKh_4bG6E",
    })
    return(
        <>
            <section className= "mapBorder">
                <div>MapView</div>
                <section className = "mapview">
                    {
                        isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={18}
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
export default MapView 

// export default withScriptsjs {
    // withGoogleMap{
//
    // }
// }
