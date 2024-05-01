import { faCar, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { LocationInfo, LocationInfoProps } from "../LocationInfo";
import {Container,Line} from "./styles";

type Props= {
    departure:LocationInfoProps;
    arrival?:LocationInfoProps | null;
}

export function Locations({departure,arrival= null}:Props) {

  return (
    <Container>
        <LocationInfo
            icon={faCar}
            label={departure.label}
            description={departure.description}
         />
         
        <Line />
        {
            arrival &&
            <>
            <LocationInfo 
                icon={faFlagCheckered}
                label={arrival.label}
                description={arrival.description}
            />
            </>
        }
          </Container>
  )};