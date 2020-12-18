import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  bottom: ${props => props.bottom || 0}px;
  position: absolute;
`;

function Background(props) {
  const { bottom } = props;
  return (
    <Container bottom={bottom}>
      
    </Container>
  );
}

export default Background;