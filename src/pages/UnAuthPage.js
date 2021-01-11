import React from 'react';
import styled from 'styled-components';
import { AnimatedWrapper } from '../components/PageAnim';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  ailgn-items: center;
  width: 100%;
`;

const Text = styled.span`
  margin-top: 50px;
  font-family: 12LotteMartDream;
  font-size: calc(10px + 1vmin);
  font-weight: 500;
  color: #ffffff;
`;

const text = "인증되지 않은 사용자입니다. 로그인 후 이용해주세요.";

function UnAuthPage(props) {
  return (
    <AnimatedWrapper>
      <Container>
        <Text>
          {text}
        </Text>
      </Container>
    </AnimatedWrapper>
  );
}

export default UnAuthPage;