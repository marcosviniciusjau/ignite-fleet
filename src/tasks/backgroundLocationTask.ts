import 
{ startLocationUpdatesAsync,
  hasStartedLocationUpdatesAsync,
  Accuracy,
  stopLocationUpdatesAsync 
} from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { saveStorageLocation } from '../libs/asyncStorage/LocationStorage';

export const BACKGROUND_LOCATION_TASK = 'location-tracking';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }:any) => {
    try{
        if (error) {
          throw error;
        }

        if(data){
            const {coords,timestamp} = data.location[0];

            const currentLocation= {
                latitude: coords.latitude,
                longitude: coords.longitude,
                timestamp
            }
            console.log(currentLocation)
            await saveStorageLocation(currentLocation)
        }

    }catch(error){
        console.log(error);
    }
});

export async function startLocationTask(){
    try {
        const hasStarted= await hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
      
        if(hasStarted) {
          await stopLocationTask();
        }
        await startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
            accuracy: Accuracy.Highest,
            distanceInterval: 1,
            timeInterval: 1000,
        });
    } catch (error) {
        console.log(error)
        stopLocationTask();
    }
}

export async function stopLocationTask(){
    try {
        const hasStarted= await hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
        if(hasStarted) {
            await stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
        };
    } catch (error) {
        console.log(error)
    }
}