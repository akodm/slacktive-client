import React from 'react';
import styled from 'styled-components';
import { AnimatedWrapper } from '../components/PageAnim';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

function MyPage(props) {
  return (
    <AnimatedWrapper>
      <Container>
        My H
      </Container>
    </AnimatedWrapper>
  );
}

export default MyPage;