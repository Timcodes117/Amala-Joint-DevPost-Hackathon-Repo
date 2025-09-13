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

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocationErrorMsg('Permission to access location was denied');
            return null;
        }

        let location = await Location.getCurrentPositionAsync({});
        setuserLocation(location);
        return location;
    }

    async function getPlacesNearby(long: number, lat: number) {
        try {
            const request = await axiosGet(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=2000&keyword=amala&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528`
            );
            // console.log(request.data); // log only the results
            setGooglePlacesApi(request.data);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    }

    async function getAddressFromCoords(lat: number, lng: number) {
        const request = await axiosGet(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528`
        );

        console.log(request)
        setUserAddress(request.data as GeocodeResponse)

        // return request.data;
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