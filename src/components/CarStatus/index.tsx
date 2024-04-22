import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TouchableOpacityProps } from 'react-native';
import { faKey,faCar } from '@fortawesome/free-solid-svg-icons';
import { Container, IconBox, Message, TextHighlight } from './styles';
import { useTheme } from 'styled-components';

type Props = TouchableOpacityProps & {
  licensePlate?: string | null;
};

export function CarStatus({ licensePlate = null, ...rest }: Props) {
  const theme = useTheme();
  const icon = licensePlate ? faCar : faKey;
  const message = licensePlate ? `Veículo ${licensePlate} em uso.` : 'Nenhum veículo em uso.';
  const status = licensePlate ? 'chegada' : 'saída';

  return (
    <Container {...rest}>
      <IconBox>
        <FontAwesomeIcon icon={icon} size={52} color={theme.COLORS.BRAND_LIGHT} />
      </IconBox>
      <Message>
        {message}
        <TextHighlight>
          Clique aqui para registrar a {status}
        </TextHighlight>
      </Message>
    </Container>
  );
}
