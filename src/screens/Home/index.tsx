import { useNavigation } from "@react-navigation/native";

import { Historic } from "../../libs/realm/schemas/Historic";
import { useEffect, useState } from "react";

import { useQuery } from "../../libs/realm";
import { CarStatus } from "../../components/CarStatus";
import { HomeHeader } from "../HomeHeader";
import { Container, Content } from "./styles";
import { Alert } from "react-native";

export function Home() {

  const [vehicleInUse,setVehicleInUse]= useState<Historic | null>(null);

  const {navigate}= useNavigation();

  const historic= useQuery(Historic);

  function handleRegisterMoviment(){
    if(vehicleInUse?._id){
      return navigate('arrival', {id:vehicleInUse._id.toString()});
    }else{
      navigate('departure');
    }
  }

  function fetchVehicle(){
    try{
      const vehicle= historic.filtered("status = 'departure'")[0];
      setVehicleInUse(vehicle);
    }catch(error){
      Alert.alert('Veiculo em uso','Não foi possivel carregar o veiculo em uso')
    }
  }

  useEffect(() => {
    fetchVehicle();
  }, []);
  return (
    <Container>
      <HomeHeader />
      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMoviment}
        />
      </Content>
    </Container>
  );
}
