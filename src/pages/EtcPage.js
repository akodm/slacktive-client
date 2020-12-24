import React from 'react';
import styled from 'styled-components';
import { AnimatedWrapper } from '../components/PageAnim';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

function EtcPage(props) {
  return (
    <AnimatedWrapper>
      <Container>
        ETC
      </Container>
    </AnimatedWrapper>
  );
}

export default EtcPage;