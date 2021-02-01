import {useState, useEffect} from 'react';
import Geolocation                from 'react-native-geolocation-service';


export const useGeolocation = ()=> {
  const [error, setError] = useState('');
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      pos => {
        console.log("pos",pos);
        setError('');
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      e => setError(e.message),
      { enableHighAccuracy: true,timeout: 5000,maximumAge:0,distanceFilter: 3,useSignificantChanges:true}
    );
    return () => Geolocation.clearWatch(watchId);
  }, []);

  return [error, position];
};