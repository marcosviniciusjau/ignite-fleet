import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import { BSON } from 'realm';
import { useObject,useRealm } from '../../libs/realm';

import { LatLng } from 'react-native-maps';
import { Historic } from '../../libs/realm/schemas/Historic';

import { Container, Content, Description, Footer, LicensePlate,AsyncMessage } from './styles';

import { Label } from '../../components/LicensePlateInput/styles';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { Map } from '../../components/Map';
import { Loading } from '../../components/Loading';
import { Locations } from '../../components/Locations';

import { getLastAsync } from '../../libs/asyncStorage/SyncStorage';
import { stopLocationTask } from '../../tasks/backgroundLocationTask';
import {  getStorageLocations} from '../../libs/asyncStorage/LocationStorage';
import { getAddress } from '../../utils/getAddress';
import { LocationInfoProps } from '../../components/LocationInfo';

type RouteParams={
    id:string
}
export function Arrival() {
    const [dataNotSynced,setDataNotSynced]= useState(false);
    const [coordinates,setCoordinates]= useState<LatLng[]>([]);
    const [departure,setDeparture]= useState<LocationInfoProps>({} as LocationInfoProps);
    const [arrival,setArrival]= useState<LocationInfoProps | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const route= useRoute();
    const { id }= route.params as RouteParams;

    const historic = useObject(Historic, new BSON.UUID(id) as unknown as string);
    const title= historic?.status === 'departure' ? 'Chegada' : 'Detalhes';

    const {goBack}= useNavigation()
    const realm= useRealm();

    function handleRemoveVehicle(){
      Alert.alert('Cancelar','Cancelar a chegada do veículo?',[
        {
          text:'Não',
          style:'cancel',
        },
        {
          text:'Sim',
          onPress:()=>{removeVehicle()},
        }
      ])
    }

    async function removeVehicle(){
      realm.write(()=>{
        realm.delete(historic);
      });
      await stopLocationTask();
      goBack();
    }

    async function handleArrivalRegister(){
      try {
        if(!historic){
          return Alert.alert('Erro', "Não foi possível registrar a chegada")
        }

        const locations= await getStorageLocations();
        realm.write(()=>{
          historic.status='arrival';
          historic.updated_at= new Date();
          historic.coords.push(...locations);
        })

        await stopLocationTask();
        Alert.alert('Chegada', 'Chegada registrada com sucesso');
        goBack();
      } catch (error) {
        console.log(error)
        Alert.alert('Erro', "Não foi possível registrar a chegada")
      }
    }

    async function getLocationsInfo(){
      if(!historic){
        return;
      }

      const lastSync= await getLastAsync();
      const updatedAt= historic!.updated_at.getTime();
      setDataNotSynced(updatedAt > lastSync);

      if(historic?.status === 'departure'){
        const locationsStorage= await getStorageLocations();
        setCoordinates(locationsStorage);
      }
      else{
        setCoordinates(historic?.coords ?? []);
      }

      if(historic?.coords[0]){
        const departureStreetName= await getAddress(historic?.coords[0]);
        setDeparture({
          label: `Saindo em ${departureStreetName ?? ''}`,
          description: dayjs(new Date(historic?.coords[0].timestamp)).format('DD/MM/YYYY [às] HH:mm')
        })
      }

      if(historic?.status === 'arrival'){
        const lastLocation= historic?.coords[historic?.coords.length - 1];
        const arrivalStreetName= await getAddress(lastLocation);
        setArrival({
          label: `Chegando em ${arrivalStreetName ?? ''}`,
          description: dayjs(new Date(lastLocation.timestamp)).format('DD/MM/YYYY [às] HH:mm')
        })
      }

      setIsLoading(false);
    }

    useEffect(()=>{
      getLocationsInfo();
    },[historic])

    if(isLoading){
      return <Loading/>
    }
  return (
    <Container>
      <Header title={title}/>

      {coordinates.length > 0 && <Map coordinates={coordinates}/>}
      <Content>
        <Locations
          departure={departure}
          arrival={arrival}
         />
        <Label>
          Placa do veículo
        </Label>

        <LicensePlate>
          {historic?.license_plate}
        </LicensePlate>

        <Label>
          Finalidade
        </Label>

        <Description>
          {historic?.description}
         </Description>

      
      </Content>

      {
          historic?.status === 'departure' &&
          <Footer>
          <ButtonIcon 
          icon={faX}
          onPress={handleRemoveVehicle}/>

          <Button
           title="Registrar Chegada"
           onPress={handleArrivalRegister}
           />
        </Footer>
        }

     {  dataNotSynced &&
        <AsyncMessage>
              Sincronização da
              {historic?.status === 'departure' ? ' partida ' : 'chegada'}
              pendente
        </AsyncMessage>
     }
    </Container>
  );
}