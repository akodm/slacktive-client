import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { LOCALSTORAGE, SERVER_URL } from '../config';
import axios from 'axios';
import { useSelector } from 'react-redux';

import FirstPage from  './FirstPage';
import CalendarPage from './CalendarPage';
import MyPage from './MyPage';
import GroupPage from './GroupPage';
import EtcPage from './EtcPage';
import UnAuthPage from './UnAuthPage';
import Develop from './Develop';

import Menu from '../components/Menu';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

const Container = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
  ${props => !props.first &&
    css`
      background-image: linear-gradient(to top, ${props => props.back || `#94d0f2, #7ea4ef`});
    `
  }
  overflow: auto;
  position: relative;
`;

const calendar = `#94d0f2, #7ea4ef`;
const my = `#d3968e, #6879d0`;
const group = `#bca8c3, #266197`;
const etc = `#2b5876, #4e4376`;

function Index(props) {
  const location = useLocation();
  const { alert } = useSelector(state => state.alertOpenCloseReducer);
  const { modal } = useSelector(state => state.modalOpenCloseReducer);
  const [ hasToken, setHasToken ] = useState(false); 
  const [ load, setLoad ] = useState(false);

  const backgroundColorChange = useMemo(() => {
    if(location?.pathname === "/my") {
      return my;
    }
    if(location?.pathname === "/group") {
      return group;
    }
    if(location?.pathname === "/etc") {
      return etc;
    } else {
      return calendar;
    }
  }, [location?.pathname]);

  const firstPage = useMemo(() => location?.pathname === "/" ? true : false, [location?.pathname]);

  const tokenCheck = useCallback( async () => {
    try {
      if(!window.localStorage.getItem(LOCALSTORAGE)) {
        setHasToken(false);
        setLoad(true);
        return false;
      }

      const localToken = window.localStorage.getItem(LOCALSTORAGE);

      const token = JSON.parse(localToken);

      const { data } = await axios.get(`${SERVER_URL}/users/token/check`, {
        headers: {
          "authorization": token.token
        }
      });

      if(data && data.message === "expire all") {
        setHasToken(false);
        window.localStorage.removeItem(LOCALSTORAGE);
        window.alert("로그인이 만료되었습니다. 다시 로그인하여 주세요.");
        return window.location.href = "/#/";
      }

      if(data && data.err) {
        throw new Error(data.message);
      }

      if(!data || !data.result) {
        throw new Error("unauth user");
      }

      if(data.token) {
        const newToken = {
          result: true,
          token: data.token
        };

        window.localStorage.setItem(LOCALSTORAGE, JSON.stringify(newToken));
      }

      setHasToken(true);
      setLoad(true);
      return;
    } catch(err) {
      window.localStorage.removeItem(LOCALSTORAGE);
      setHasToken(false);
      window.alert(err.mesaage || err);
      setLoad(true);
      return;
    }
  }, []);

  useEffect(() => {
    tokenCheck();
  }, [tokenCheck]);
  
  return (
    <Container first={firstPage} back={backgroundColorChange}>
      { location?.pathname !== "/" && <Menu path={location?.pathname} /> }
      { alert && <Alert /> }
      { modal && <Modal /> }
      <Switch>
        <Route exact path="/"><FirstPage setHasToken={setHasToken} /></Route>
        <Route path="/unauth"><UnAuthPage /></Route>
        {
          hasToken ? <>
            <Route path="/calendar"><CalendarPage /></Route>
            <Route path="/my"><MyPage /></Route>
            <Route path="/group"><GroupPage /></Route>
            <Route path="/etc"><EtcPage /></Route>
            <Route path="/develop/display"><Develop /></Route>
          </>
          :
          load &&
          <Redirect to="/unauth" />
        }
      </Switch>
    </Container>
  );
}

export default Index;