import { TouchableOpacityProps } from "react-native";
import { useTheme } from "styled-components/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconLookup, IconName } from "@fortawesome/fontawesome-svg-core";

import { Container } from "./styles";

type Props = TouchableOpacityProps & {
  icon: IconLookup | IconName;
};

export function ButtonIcon({ icon, ...rest }: Props) {
  const { COLORS } = useTheme();

  return (
    <Container activeOpacity={0.7} {...rest}>
      <FontAwesomeIcon icon={icon} size={24} color={COLORS.BRAND_MID} />
    </Container>
  );
}
