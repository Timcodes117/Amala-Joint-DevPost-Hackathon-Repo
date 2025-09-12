import React from 'react'
import { useAppContext } from '../../contexts/app';
import { View, Text } from 'react-native';
import { router } from 'expo-router';

function Permission() {
  const { getCurrentLocation, userLocation } = useAppContext()
  const [isFetching, setIsFetching] = React.useState<boolean>(false);

  
  React.useEffect(() => {
    const fetchLocation = async () => {
      setIsFetching(true);
      await getCurrentLocation();
      setIsFetching(false);
    };

    fetchLocation();
  }, []);

  React.useEffect(() => {
    if (userLocation) {
      router.replace("/home_screen/home"); // 👈 safer than push for auth/permission flows
    }
  }, [userLocation]);

  return (
    <View>
      <Text>Permission</Text>
    </View>
  )
}

export default Permission;