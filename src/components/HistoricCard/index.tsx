import { TouchableOpacityProps } from 'react-native';
import { Container, Departure, Info, LicensePlate } from './styles';

import { faCheck,faClock } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from 'styled-components/native';

export type HistoricCardProps = {
    id: string;
    licensePlate: string;
    created: string;
    isSync?: boolean;
}

type Props= TouchableOpacityProps &{
    data: HistoricCardProps;
};

export function HistoricCard({ data, ...rest }: Props) {
    const {COLORS}= useTheme();
  return (
    <Container activeOpacity={0.7} {...rest}>
        <Info>
            <LicensePlate>
                {data.licensePlate}
            </LicensePlate>

            <Departure>
                {data.created}
            </Departure>
        </Info>
        {data.isSync ? (
            <FontAwesomeIcon icon={faCheck} size={24} color={COLORS.BRAND_LIGHT} />
        ) : (
            <FontAwesomeIcon icon={faClock} size={24} color={COLORS.GRAY_400} />
        )}
    </Container>
  );
}