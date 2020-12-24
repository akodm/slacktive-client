import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: ${props => props.back};
  overflow: hidden;
`;

const LoginButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 172px;
  height: 40px;
  cursor: pointer;
  transition-property: transform, background-color;
  transition: transform ease 0.3s 0s;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(1.2);
  }
`;

function FirstPage(props) {
  const history = useHistory();
  const [ color, setColor ] = useState("#03A9F4");

  useEffect(() => {
    const time = setInterval(() => {

    }, 1500);

    return () => clearInterval(time);
  }, []);

  const login = useCallback( async () => {
    console.log("slack login btn click");
    try {
      history.replace("/calendar");
    } catch(err) {
      console.log(err);
    }
  }, [history]);

  const random = useCallback(() => {
    let arr = [4];
    arr = arr.map(() => {

    });
  }, []);

  return (
    <Container back={color}>
      <LoginButton onClick={login}>
        <img alt="Sign in with Slack" height="40" width="172" 
        src="https://platform.slack-edge.com/img/sign_in_with_slack.png" 
        srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, 
        https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" />
      </LoginButton>
    </Container>
  );
}

export default FirstPage;