import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler'; // quando o usuário arrasta alguma coisa. state: constante

import Header from '~/components/Header'; // já vai direto pra src (ver Babel)
import Tabs from '~/components/Tabs';
import Menu from '~/components/Menu';

import { Container, Content, CardHeader, CardContent, CardFooter, Card, Title, Description,  Annotation} from './styles';

export default function  Main() {
  let offset = 0; // quantos pixels o usuário arrastou
  const translateY = new Animated.Value(0); // otimizada para atualizar muitas vezes mantendo performace
  
  const animatedEvent = Animated.event( // captar a posição que o objeto está
    [
      {
        nativeEvent: {
          translationY: translateY, // translateY recebe a posição arrastada pelo usuário
        }
      }
    ],
    { useNativeDriver: true } // utiliza o driver nativo de animações, não js. performace melhor
  )

  function onHandlerStateChanged(event) {
    if (event.nativeEvent.oldState === State.ACTIVE) { // se o estado anterior era ativo e agora não é mais = usuário finalizou a animação
      let opened = false; // menu visível ou nao
      const { translationY } = event.nativeEvent;

      offset += translationY;

      if (translationY >= 100) {
        opened = true; 
      } else { // sempre que não passa de 100, ele volta
        translateY.setValue(offset);
        translateY.setOffset(0);
        offset = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? 380 : 0,
        duration: 200,
        useNativeDriver: true
      }).start(() => { // ao finalizar a animação
        offset = opened ? 380 : 0;
        translateY.setOffset(offset);
        translateY.setValue(0)
      });

      
    }
  }

  return(
    <Container>
      <Header />

      <Content>
        <Menu translateY={translateY} />

        <PanGestureHandler
          onGestureEvent={animatedEvent}
          onHandlerStateChange={onHandlerStateChanged}
        >
          <Card style={{
            transform: [{
              translateY: translateY.interpolate({ // quais são os valores que a translateY pode chegar
                inputRange: [-200, 0, 380], // valor da variável
                outputRange: [-50, 0, 380], // valor de saída para a propriedade
                extrapolate: 'clamp', // o que fazer se a variável atingir o limite: não permitir
              })
            }]
          }}>
            <CardHeader>
              <Icon name="attach-money" size={28} color="#666" />
              <Icon name="visibility-off" size={28} color="#666" />
            </CardHeader>
            <CardContent>
              <Title>Saldo disponível</Title>
              <Description>R$ 192.168,11</Description>
            </CardContent>
            <CardFooter>
              <Annotation>Transferência de R$ 1000,00 recebida de Maurício Grandi hoje às 10:00h.</Annotation>
            </CardFooter>
          </Card>
        </PanGestureHandler>

      </Content>

      <Tabs translateY={translateY} />
    </Container>
  )
}

