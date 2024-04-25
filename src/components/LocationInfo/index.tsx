import { IconLookup, IconName, faCar } from '@fortawesome/free-solid-svg-icons';
import { IconBox } from '../IconBox';
import { Container,Info,Label,Description } from './styles';

export type LocationInfoProps = {
    label:string;
    description:string;
    icon: IconLookup | IconName;
}

export function LocationInfo({icon,label,description}:
    LocationInfoProps
) {
  return (
    <Container>
        <IconBox icon={faCar}/>
        <Info>

        <Label numberOfLines={1}>
            {label}	
        </Label>
        <Description numberOfLines={1}>
            {description}
        </Description>
        </Info>

    </Container>
  );
}