import { faX } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import { BSON } from 'realm';
import { useObject,useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

import { Container, Content, Description, Footer, LicensePlate } from './styles';

import { Label } from '../../components/LicensePlateInput/styles';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';

type RouteParams={
    id:string
}
export function Arrival() {
    const route= useRoute();
    const { id }= route.params as RouteParams;

    const historic= useObject(Historic, new BSON.UUID(id));
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

  return (
    <Container>
      <Header title="Chegada"/>
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

        <Footer>
          <ButtonIcon 
          icon={faX}
          onPress={handleRemoveVehicle}/>
          <Button
           title="Registrar Chegada"
           />
        </Footer>
      </Content>
     

    </Container>
  );
}