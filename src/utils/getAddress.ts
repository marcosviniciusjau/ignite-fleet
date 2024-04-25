import { reverseGeocodeAsync,LocationObjectCoords} from 'expo-location'

export async function getAddress({latitude,longitude}:LocationObjectCoords) {
    try {
        const adressResponse= await reverseGeocodeAsync({latitude,longitude});

        return adressResponse[0]?.street;
        
    } catch (error) {
        console.log(error);
    }
}