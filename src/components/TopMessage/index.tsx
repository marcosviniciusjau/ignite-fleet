import React from 'react';
import { Container, Title } from './styles';
import { IconLookup, IconName } from '@fortawesome/fontawesome-svg-core';
import { TouchableOpacityProps } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = TouchableOpacityProps & {
    icon: IconLookup | IconName;
    title:string;
};
  
export function TopMessage({title,icon}:Props) {
    const {COLORS}= useTheme();
    const insets= useSafeAreaInsets();

    const paddingTop= insets.top + 5;
  return (
    <Container style={{paddingTop}}>
        {
            icon && <FontAwesomeIcon icon={icon} color={COLORS.GRAY_100} size={10} />
        }
        <Title>
            {title}

        </Title>

    </Container>
  );
}