import React, { useMemo } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import FirstPage from  './FirstPage';
import CalendarPage from './CalendarPage';
import MyPage from './MyPage';
import GroupPage from './GroupPage';
import EtcPage from './EtcPage';

import Menu from '../components/Menu';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  ${props => !props.first &&
    css`
      background-image: linear-gradient(to top, ${props => props.back || `#94d0f2, #7ea4ef`});
    `
  }
  overflow: hidden;
  position: relative;
`;

const calendar = `#94d0f2, #7ea4ef`;
const my = `#d3968e, #6879d0`;
const group = `#bca8c3, #266197`;
const etc = `#2b5876, #4e4376`;

function Index(props) {
  const location = useLocation();

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

  return (
    <Container first={firstPage} back={backgroundColorChange}>
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