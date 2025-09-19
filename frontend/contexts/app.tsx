import { View, Text } from 'react-native'
import * as Location from 'expo-location';
import React from 'react'
import { axiosGet } from '../utils/api';
import { GeocodeResponse, PlacesApiResponse } from '../utils/types/places_api_types';


interface AppContextProps {
    getCurrentLocation: () => Promise<Location.LocationObject | null>;
    userLocation: Location.LocationObject | null;
    getPlacesNearby: (long: number, lat: number) => void;
    getAddressFromCoords: (lat: number, long: number) => void;
    UserAddress: GeocodeResponse | undefined;
    googlePlacesApi: PlacesApiResponse | undefined;

}


const AppContext = React.createContext<AppContextProps | undefined>(undefined);


const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [userLocation, setuserLocation] = React.useState<Location.LocationObject | null>(null);
    const [LocationErrorMsg, setLocationErrorMsg] = React.useState<string | null>(null);
    const [googlePlacesApi, setGooglePlacesApi] = React.useState<PlacesApiResponse>()
    const [UserAddress, setUserAddress] = React.useState<GeocodeResponse>()

    async function getCurrentLocation(): Promise<Location.LocationObject | null> {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log('Location permission status:', status);
            
            if (status !== 'granted') {
                setLocationErrorMsg('Permission to access location was denied');
                console.log('Location permission denied');
                return null;
            }

            console.log('Getting current position...');
            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            
            console.log('Location obtained:', location);
            setuserLocation(location);
            return location;
        } catch (error) {
            console.error('Error getting location:', error);
            setLocationErrorMsg('Failed to get current location');
            return null;
        }
    }

    async function getPlacesNearby(long: number, lat: number) {
        try {
            console.log('Getting places nearby for coordinates:', { lat, long });
            const request = await axiosGet(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=2000&keyword=amala&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528`
            );
            console.log('Places API response:', request.data);
            setGooglePlacesApi(request.data);
        } catch (error) {
            console.error("Error fetching places:", error);
            // Set empty results on error
            setGooglePlacesApi({
                html_attributions: [],
                results: [],
                status: "ERROR"
            });
        }
    }

    async function getAddressFromCoords(lat: number, lng: number) {
        try {
            console.log('Getting address for coordinates:', { lat, lng });
            const request = await axiosGet(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528`
            );
            console.log('Geocode response:', request.data);
            setUserAddress(request.data as GeocodeResponse);
        } catch (error) {
            console.error('Error getting address:', error);
            // Set fallback address
            setUserAddress({
                results: [{
                    formatted_address: 'Lagos, Nigeria',
                    address_components: [],
                    geometry: { location: { lat, lng } },
                    place_id: 'fallback'
                }],
                status: 'OK'
            });
        }
    }







    return (
        <AppContext.Provider value={{ getCurrentLocation, userLocation, getPlacesNearby, getAddressFromCoords, UserAddress, googlePlacesApi }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;


export const useAppContext = () => {
    const context = React.useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be wrapped btw a <AppContextProvider /> in the root file");
    }

    return context;
}