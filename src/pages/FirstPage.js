import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to right, #a8c0ff, #3f2b96);
  overflow: hidden;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 5rem;
  color: white;
  animation: ani 1.5s infinite alternate;
  font-family: 'Raleway', sans-serif;

  &::before {
    content: '☆';
    height: 100%;
    font-size: 3rem;
  }

  @keyframes ani{
    0%{transform:translate(0,0);}
    100%{transform:translate(0,50px);}
  }

  @media (max-width: 375px) {
    font-size: 2rem;

    &::before {
      font-size: 1rem;
    }
  }
`;

// Slacktive 에 마우스 over 할 경우 active 를 돋보이도록
const ActiveTitle = styled.span`
  transition: 0.6s;
  text-decoration: ${props => props.hover ? 'underline' : 'none'};
  color: ${props => props.hover ? '#EF5350' : 'white'};
  margin: ${props => props.hover ? '0 0px' : '0 20px'};

  @media (max-width: 375px) {
    margin: ${props => props.hover ? '0 0px' : '0 7px'};
  }
`;

// Slacktive 기본 Style sheet
const OriginTitle = styled.span`
  margin: 0 20px;

  @media (max-width: 375px) {
    margin: 0 3px;
  }
`;

const IntroText = styled.div`
  font-size: 2rem;
  font-family: 'Noto Serif KR', serif;

  @media (max-width: 375px) {
    font-size: 1rem;
  }
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
  const [ hoverTitle, setHoverTitle ] = useState(false);
  const [ loginBtnSize, setLoginBtnSize ] = useState({width: '210px', height: '45px'});

  useEffect(() => {
    const time = setInterval(() => {

    }, 1500);

    return () => clearInterval(time);
  }, []);

  useEffect(() => {
    const { width } = window.screen;
    if (width > 375) { setLoginBtnSize({width: '210px', height: '45px'}); }
    else { setLoginBtnSize({width: '170px', height: '40px'}); }
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

  const title = useCallback(() => {
    const strArr = ['S', 'l', 'a', 'c', 'k', 't', 'i', 'v', 'e'];
    return strArr.map((elem, idx) => {
      return (
        elem === 'a' || elem === 'c' || elem === 't' || elem === 'i' || elem === 'v' || elem === 'e' ?
        <ActiveTitle key={idx} hover={hoverTitle}>{elem}</ActiveTitle>
        :
        <OriginTitle key={idx}>{elem}</OriginTitle>
      )
    })
  }, [hoverTitle]);

  return (
    <Container>
      <Title onMouseOver={() => setHoverTitle(true)} onMouseOut={() => setHoverTitle(false)}>{title()}</Title>
      <IntroText>Slack 에 연동하여 시작해보세요.</IntroText>
      <LoginButton onClick={login}>
        <img alt="Sign in with Slack" height={loginBtnSize.height} width={loginBtnSize.width} 
        src="https://platform.slack-edge.com/img/sign_in_with_slack.png" 
        srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, 
        https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" />
      </LoginButton>
    </Container>
  );
}

export default FirstPage;