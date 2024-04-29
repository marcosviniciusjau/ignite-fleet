import { faX } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import { BSON } from 'realm';
import { useObject,useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

import { Container, Content, Description, Footer, LicensePlate,AsyncMessage } from './styles';

import { Label } from '../../components/LicensePlateInput/styles';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { useEffect, useState } from 'react';
import { getLastAsync } from '../../libs/asyncStorage/SyncStorage';
import { stopLocationTask } from '../../tasks/backgroundLocationTask';

type RouteParams={
    id:string
}
export function Arrival() {
    const [dataNotSynced,setDataNotSynced]= useState(false);

    const route= useRoute();
    const { id }= route.params as RouteParams;

    const historic= useObject(Historic, new BSON.UUID(id));

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

    function removeVehicle(){
      realm.write(()=>{
        realm.delete(historic);
      });
      goBack();
    }

    async function handleArrivalRegister(){
      try {
        if(!historic){
          return Alert.alert('Erro', "Não foi possível registrar a chegada")
        }
        await stopLocationTask();
        realm.write(()=>{
          historic.status='arrival';
          historic.updated_at= new Date();
        })

        Alert.alert('Chegada', 'Chegada registrada com sucesso');
        goBack();
      } catch (error) {
        console.log(error)
        Alert.alert('Erro', "Não foi possível registrar a chegada")
      }
    }

    useEffect(()=>{
      getLastAsync()
      .then(lastSync =>setDataNotSynced(historic!.updated_at.getTime() > lastSync));
      
    },[historic])

  return (
    <Container>
      <Header title={title}/>
      <Content>
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
              {historic?.status === 'departure' ? 'partida' : 'chegada'}
              pendente
        </AsyncMessage>
     }
    </Container>
  );
}