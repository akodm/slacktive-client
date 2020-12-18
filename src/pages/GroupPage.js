import React from 'react';
import styled from 'styled-components';
import { AnimatedWrapper } from '../components/PageAnim';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

function GroupPage(props) {
  return (
    <AnimatedWrapper>
      <Container>
        Group Page
      </Container>
    </AnimatedWrapper>
  );
}

export default GroupPage;