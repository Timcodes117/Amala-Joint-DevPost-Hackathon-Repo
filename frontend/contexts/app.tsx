import { View, Text } from 'react-native'
import * as Location from 'expo-location';
import React from 'react'
import { axiosGet } from '../utils/api';


interface AppContextProps {
    getCurrentLocation: () => Promise<any>;
    userLocation: Location.LocationObject | null;
    getPlacesNearby: (long: number, lat: number) => void;

}


const AppContext = React.createContext<AppContextProps | undefined>(undefined);


const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [userLocation, setuserLocation] = React.useState<Location.LocationObject | null>(null);
    const [LocationErrorMsg, setLocationErrorMsg] = React.useState<string | null>(null);

    async function getCurrentLocation() {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocationErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setuserLocation(location);
        return location;
    }

    async function getPlacesNearby(long: number, lat: number) {
        // const request = await axiosGet(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${long},${lat}&radius=2000&keyword=coffee&key=AIzaSyBpl-xRWJT8QjA008Cg3IhrsRQ-W6OJ-EM`)
        // console.log(request);
    }

    
  



    return (
        <AppContext.Provider value={{ getCurrentLocation, userLocation, getPlacesNearby }}>
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