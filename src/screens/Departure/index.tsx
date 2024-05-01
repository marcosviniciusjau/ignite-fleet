import { useEffect, useRef, useState } from 'react';
import { TextInput,ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
   useForegroundPermissions,
   requestBackgroundPermissionsAsync,
   watchPositionAsync,
   LocationAccuracy,
   LocationSubscription,
   LocationObjectCoords
} from 'expo-location';

import { useNavigation } from '@react-navigation/native';

import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useUser } from '@realm/react';

import { licensePlateValidate } from '../../utils/licensePlateValidate';
import { getAddress } from '../../utils/getAddress';

import { Container, Content, Message, MessageContent } from './styles';

import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Map } from '../../components/Map';
import { LocationInfo } from '../../components/LocationInfo';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { startLocationTask } from '../../tasks/backgroundLocationTask';
import { openSettings } from '../../utils/openSettings';

export function Departure() {
  const [description,setDescription]= useState('');
  const [licensePlate,setLicensePlate]= useState('');

  const [isRegistering,setIsRegistering]= useState(false);

  const [isLoading, setIsLoading] = useState(true);  
  const [currentAddress,setCurrentAddress] = useState<string | null>(null);
 
  const [currentCoords,setCurrentCoords] = useState<LocationObjectCoords | null>(null);

  const [locationPermission,requestLocationPermission]= useForegroundPermissions();

  const {goBack}= useNavigation();

  const realm = useRealm();
  const user = useUser();

  const descriptionRef= useRef<TextInput>(null);
  const licensePlateRef= useRef<TextInput>(null);

  async function handleDepartureRegister() {
    try{
      if(!licensePlateValidate(licensePlate)){
        licensePlateRef.current?.focus();
        return Alert.alert('Placa inválida', 'A Placa é inválida');
      }
      if(description.trim().length === 0){
        descriptionRef.current?.focus();
        return Alert.alert('Finalidade inválida', 'A Finalidade é inválida');
      }

      if(!currentCoords?.latitude || !currentCoords.longitude){
        return Alert.alert('Localização inválida', 'Não foi possível encontrar sua localização');
      }

      setIsRegistering(true);

      const backgroundPermission = await requestBackgroundPermissionsAsync();
      if(!backgroundPermission?.granted){
        setIsRegistering(false);
        
        return Alert.alert(
          'Localização', 
          'Para registrar a saída, você deve autorizar o acesso a sua localização em segundo plano',
          [
            {
              text:'Abrir configurações', 
              onPress:()=>{openSettings()},
            }
          ]
        );
      
      }
      
      await startLocationTask();
      
      realm.write(()=>{
        realm.create('Historic',Historic.generate({
          user_id: user!.id,
          license_plate: licensePlate.toUpperCase(),
          description,
          coords:[{
            latitude:currentCoords.latitude,
            longitude:currentCoords.longitude,
            timestamp:new Date().getTime()
          }]
        }));
      });

      Alert.alert('Saída', 'Sua saída do veículo registrada com sucesso');
      goBack();

    }catch(error){
      console.log(error);
      Alert.alert('Erro', 'Ocorreu um erro ao registrar a saída');
      setIsRegistering(false);
    }
  }

  useEffect(()=>{
    requestLocationPermission();
  })

  useEffect(() => {
    if(!locationPermission?.granted){
      return
    } 
    let subscription: LocationSubscription;
    
    watchPositionAsync({
      accuracy: LocationAccuracy.High,
      timeInterval: 1000
    }, (location) => {
      setCurrentCoords(location.coords)
      getAddress(location.coords)
        .then(address => {
          if(address) {
            setCurrentAddress(address)
          }
        })
        .finally(() => setIsLoading(false))
    }).then(response => subscription = response);
    return () => {
      if(subscription) {
        subscription.remove()
      }
    };
  }, [locationPermission?.granted])

  if(!locationPermission?.granted) {
    return (
      <Container>
        <Header title='Saída' />
        <MessageContent>
        <Message>
          Você precisa permitir que o aplicativo tenha acesso a 
          localização para acessar essa funcionalidade. Por favor, acesse as
          configurações do seu dispositivo para conceder a permissão ao aplicativo.
        </Message>
        <Button title="Abrir configurações" onPress={openSettings} />
        </MessageContent>

      </Container>
    )
  }

  if(isLoading) {
    return <Loading />
  }

  return (
    <Container>
      <Header title="Saída"/>

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          
        {currentCoords && <Map coordinates={[currentCoords]}/>}
    
         <Content>
         {
              currentAddress &&
              <LocationInfo
                icon={faCar}
                label='Localização atual'
                description={currentAddress}
              />
            }
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA-1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Escreva sua finalidade"
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
            title="Registrar Saída"
            isLoading={isRegistering}
            onPress={handleDepartureRegister}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}