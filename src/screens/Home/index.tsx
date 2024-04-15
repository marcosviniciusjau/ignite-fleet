import { CarStatus } from '../../components/CarStatus';
import { HomeHeader } from '../HomeHeader';
import { Container, Content } from './styles';

export function Home() {
  return (
    <Container>
      <HomeHeader />
      <Content>
        <CarStatus />
      </Content>
    </Container>
  );
}