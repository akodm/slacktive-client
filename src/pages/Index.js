import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { LOCALSTORAGE, SERVER_URL } from '../config';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { requestAxios } from '../util/request';
import { calendarInit, usersInit } from '../actions/calendar';
import { slackLogin } from '../actions/login';
import { mypageDataInit } from '../actions/mypage';

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
import Loadmask from '../components/Loadmask';

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
const category = [
  { select: "1", text: "출장/미팅", colors: "#d6ff98" },
  { select: "2", text: "휴가", colors: "#FFEB3B" },
  { select: "3", text: "회의", colors: "#87dffa" },
  { select: "4", text: "생일", colors: "#b0c0ff" },
  { select: "5", text: "기타", colors: "#ff98c3" },
];

function Index(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { alert } = useSelector(state => state.alertOpenCloseReducer);
  const { modal } = useSelector(state => state.modalOpenCloseReducer);
  const { user } = useSelector(state => state.slackLoginReducer);
  const [ hasToken, setHasToken ] = useState(false); 
  const [ load, setLoad ] = useState(false);
  const calendarInitAction = useCallback((payload) => dispatch(calendarInit(payload)), [dispatch]);
  const usersInitAction = useCallback((payload) => dispatch(usersInit(payload)), [dispatch]);
  const slackLoginAction = useCallback((payload) => dispatch(slackLogin(payload)), [dispatch]);
  const mypageDataInitAction = useCallback((payload) => dispatch(mypageDataInit(payload)), [dispatch]);

  // 배경 설정.
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

  // 초기 페이지 여부.
  const firstPage = useMemo(() => location?.pathname === "/" ? true : false, [location?.pathname]);

  // 토큰 검사 함수.
  const tokenCheck = useCallback( async () => {
    try {
      if(!window.localStorage.getItem(LOCALSTORAGE)) {
        setHasToken(false);
        setLoad(true);
        return false;
      }

      const localToken = window.localStorage.getItem(LOCALSTORAGE);

      const { token } = JSON.parse(localToken);

      const { data } = await axios.get(`${SERVER_URL}/users/token/check`, {
        headers: {
          "authorization": token
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

      if(data.slackId) {
        const { response, result, status, message } = await requestAxios({ method: "get", url: `/users/one?slackId=${data.slackId}` });

        if(!result || status === 500) {
          throw new Error(message);
        }

        slackLoginAction(response.data);
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
  }, [slackLoginAction]);

  // 토큰 검사 실행.
  useEffect(() => {
    tokenCheck();
  }, [tokenCheck]);

  // 모든 유저 가져오기.
  const allUserInit = useCallback( async () => {
    try {
      const { response, result, status, message } = await requestAxios({ method: "get", url: "/users/all" });

      if(!result || status === 500) {
        throw new Error(message);
      }

      usersInitAction(response.data);
    } catch(err) {
      console.log(err);
      window.alert(err.message || err);
    }
  }, [usersInitAction]);

  // 캘린더 일정 색상 파싱.
  const bgColorParser = useCallback((value) => {
    return category.reduce((first, data) => {
      if(data.text === value.category) {
        return data.colors;
      }

      return first;
    }, "#FFEB3B");
  }, []);
  
  // 데이터를 캘린더에 사용할 수 있도록 파싱.
  const scheduleParser = useCallback((array, type) => {
    let result = Array.isArray(array) ? array : [array];

    return result.map((data) => {
      const bgColor = bgColorParser(data);
      if(type === "휴가") {
        return {
          ...data,
          calendarId: "98",
          title: data.text,
          body: data.count,
          bgColor,
          type: data.category,
          category: "time",
          isAllDay: !/반차/.test(data.category),
        }
      }

      return { 
        ...data, 
        calendarId: "99", 
        body: data.text, 
        bgColor, 
        type: data.category,
        category: "time",
        isAllDay: false,
      };
    });
  }, [bgColorParser]);

  // 초기 캘린더 스케쥴 데이터 이닛.
  const initSchedule = useCallback( async () => {
    try {
      let holidays = requestAxios({ method: "get", url: `/holiday/all` });
      let tasks = requestAxios({ method: "get", url: `/task/all` });

      await Promise.all([holidays, tasks]).then(result => {
        holidays = result[0];
        tasks = result[1];
      });

      const { response, result, status, message } = holidays;
      const { response: taskResponse, result: taskResult, status: taskStatus, message: taskMessage } = tasks;

      if(!result || status === 500 || !taskResult || taskStatus === 500) {
        throw new Error(message || taskMessage);
      }

      const parseItemTask = scheduleParser(taskResponse.data, "일정");
      const parseItem = scheduleParser(response.data, "휴가");

      const newItems = [];
      
      parseItemTask.forEach(data => {
        newItems.push({ ...data });
      });

      parseItem.forEach(data => {
        newItems.push({ ...data });
      });

      calendarInitAction(newItems);
    } catch(err) {
      console.log(err);
      window.alert(err.message || err);
    }
  }, [calendarInitAction, scheduleParser]);

  // 토큰 정상 처리 후 데이터 이닛.
  useEffect(() => {
    hasToken && initSchedule();
    hasToken && allUserInit();
  }, [hasToken, initSchedule, allUserInit]);

  // 마이페이지 초기 데이터 가져오기.
  const mypageDataInitEvent = useCallback( async () => {
    try {
      const holidays = await requestAxios({ method: "get", url: `/holiday/one/holiday` });
      const tardys = await requestAxios({ method: "get", url: `/commute/one/tardy` });

      if(!holidays.result || holidays.status === 500 || !tardys.result || tardys.status === 500) {
        throw new Error(holidays.message || tardys.message);
      }

      mypageDataInitAction({ 
        holidays: holidays.response.data, 
        tardys: tardys.response.data, 
      });
    } catch(err) {
      console.log(err);
      window.alert(err.message || err);
    }
  }, [mypageDataInitAction]);

  // 토큰 처리 후 마이페이지 데이터 이닛.
  useEffect(() => {
    hasToken && user && mypageDataInitEvent(user);
  }, [hasToken, mypageDataInitEvent, user]);
  
  return (
    <Container first={firstPage} back={backgroundColorChange}>
      { location?.pathname !== "/" && <Menu path={location?.pathname} /> }
      <Loadmask />
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