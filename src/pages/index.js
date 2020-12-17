import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import FirstPage from  './FirstPage';
import CalendarPage from './Calendar';
import MyPage from './MyPage';
import GroupPage from './GroupPage';
import EtcPage from './EtcPage';

import Menu from '../components/Menu';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to top, #94d0f2, #7ea4ef);
  overflow: hidden;
  position: relative;
`;

function Index(props) {
  const location = useLocation();
  return (
    <Container>
      { location?.pathname !== "/" && <Menu path={location?.pathname} /> }
      <Switch>
        <Route exact path="/"><FirstPage /></Route>
        <Route path="/calendar"><CalendarPage /></Route>
        <Route path="/my"><MyPage /></Route>
        <Route path="/group"><GroupPage /></Route>
        <Route path="/etc"><EtcPage /></Route>
      </Switch>
    </Container>
  );
}

export default Index;