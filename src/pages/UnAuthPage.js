import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
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
  cursor: pointer;
  transition-property: color, transform;
  transition: ease 0.3s 0s;

  &:hover {
    color: pink;
    transform: scale(1.1);
  }
`;

const text = "인증되지 않은 사용자입니다. 이곳을 클릭하여 로그인 후 이용해주세요.";

function UnAuthPage(props) {
  const history = useHistory();

  const redirect = useCallback(() => history.replace("/"), [history]);

  return (
    <AnimatedWrapper>
      <Container>
        <Text onClick={redirect}>
          {text}
        </Text>
      </Container>
    </AnimatedWrapper>
  );
}

export default UnAuthPage;