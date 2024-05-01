import { useTheme } from 'styled-components';

import { Container, SizeProps } from './styles';
import { IconLookup, IconName, faCar, faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

type Props ={
  size?: SizeProps;
  icon: IconLookup | IconName;
};

export function IconBox({ icon, size='NORMAL' }: Props) {
    const iconSize = size === 'NORMAL' ? 24 : 16

    const { COLORS } = useTheme()
  
    return (
      <Container size={size}>
      <FontAwesomeIcon size={iconSize} color={COLORS.BRAND_MID} icon={icon} />
    </Container>
  );
}
