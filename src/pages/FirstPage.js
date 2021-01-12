import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { SERVER_URL, LOCALSTORAGE } from '../config';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const LoginButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 210px;
  height: 45px;
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

  const login = useCallback(() => {
      window.location.href = SERVER_URL + '/api/login'
  }, []);

  const access = useCallback( async (code) => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/access?code=${code}`);

      if(data.err) {
        throw new Error(data.message);
      }

      window.localStorage.setItem(LOCALSTORAGE, JSON.stringify(data));

      history.replace("/calendar");
    } catch(err) {
      window.localStorage.removeItem(LOCALSTORAGE);
      window.alert("로그인에 실패하였습니다: " + err.message || err);
    }
  }, [history]);

  useEffect(() => {
    const urls = new URL(window.location);
    const code = urls.searchParams.get("code");
    const error = urls.searchParams.get("error");

    if(code) {
      access(code);
    }
    if(error) {
      window.alert("로그인에 실패하였습니다.");
    }
  }, [access]);

  return (
    <Container>
      <LoginButton onClick={login}>
        <img alt="Sign in with Slack" height={"45px"} width={"210px"} 
          src="https://platform.slack-edge.com/img/sign_in_with_slack.png" 
          srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, 
          https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
        />
      </LoginButton>
    </Container>
  );
}

export default FirstPage;