import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Home} from '../screens/Home'
import {Departure} from '../screens/Departure'		
const {Navigator, Screen} = createNativeStackNavigator();

export function AppRoutes(){
    return(
        <Navigator screenOptions={{headerShown: false}}>
            <Screen
            name="Home"
            component={Home}>
            </Screen>

            <Screen
            name="departure"
            component={Departure}>
            </Screen>
            </Navigator>

    )
}