import { TouchableOpacity } from 'react-native';
import {Power} from 'phosphor-react-native';
import { Container, Greeting, Message, Name, Picture } from './styles';
import theme from '../../theme';

export function HomeHeader() {
  return (
    <Container>
        <Picture
        source={{uri:"https://github.com/marcosviniciusjau.png"}}
        placeholder="L184i9offQof00ayfQay~qj[fQj["/>
         <Greeting>
        <Message>
            Olá 
        </Message>
        <Name>
            Marcos
        </Name>
    <TouchableOpacity>
    <Power size={32} color={theme.COLORS.GRAY_400}/>
    </TouchableOpacity>
    </Greeting>
    </Container>
   
  );
}