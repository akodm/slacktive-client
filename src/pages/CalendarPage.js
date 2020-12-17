import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import { TuiCalendar } from '../components/Tui';
import BackgroundContainer from '../components/Background';
import { AnimatedWrapper } from '../components/PageAnim';

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 32px;

  @media (max-width: 375px) {
    padding: 16px;
  }
`;

const TopLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 375px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`;

const TopText = styled.span`
  text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  font-family: 12LotteMartDream;
  font-size: calc(23px + 1vmin);
  font-weight: 500;
  line-height: 1.17;
  color: #ffffff;
  white-space: pre-line;
  word-break: keep-all;
`;

const TopIcon = styled.img`
  width: 85px;
  height: 85px;
  object-fit: cover;

  @media (max-width: 375px) {
    margin-bottom: 20px;
  }
`;

const TopTodayLane = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 43px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.17);
  margin-top: 30px;

  @media (max-width: 375px) {
    margin-top: 16px;
  }
`;

const TodayTextLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  color: white;
  width: 50%;
`;

const TodayText = styled.span`
  font-family: 12LotteMartDream;
  font-size: calc(10px + 1vmin);
  font-weight: 500;
  color: #ffffff;
  margin: 15px;

  @media (max-width: 510px) {
    font-size: calc(5px + 1vmin);
    margin: 10px;
  }

  @media (max-width: 390px) {
    font-size: calc(4px + 1vmin);
    margin: 8px;
  }

  @media (max-width: 375px) {
    font-size: 18px;
    margin: 8px;
  }
`;

const TodayUserText = styled.span`
  font-family: 12LotteMartDream;
  font-size: calc(8px + 1vmin);
  font-weight: 500;
  color: #ffffff;
  margin: 5px;

  @media (max-width: 510px) {
    font-size: calc(5px + 1vmin);
    margin: 2px;
  }

  @media (max-width: 390px) {
    font-size: calc(3px + 1vmin);
    margin: 1px;
  }

  @media (max-width: 375px) {
    display: flex;
    align-items: center;
    font-size: 18px;
    margin: 8px;
  }
`;

const Arrow = styled(ChevronRightOutlinedIcon)`
  color: white;
  margin-bottom: 2px;
  margin-left: 5px;
  cursor: pointer;

  &:active {
    color: rgba(210, 210, 210, 210);
  }
`;

const dummyName = `더미`;
const topText = `, 좋은아침!\n9시 45분에 출근하셨네요`;
const todayTardyText = `지각자`;
const todayHolidayText = `휴가자`;

const dummy1 = ["더미", "더미", "더미"];
const dummy2 = ["더미", "더미"];
const browserSize = 375;

function CalendarPage(props) {
  const [ windowSize, setWindowSize ] = useState(window.innerWidth);

  const browserHandler = useCallback((e) => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', browserHandler);

    return () => window.removeEventListener('resize', browserHandler);
  }, [browserHandler]);

  const DisplayUser = useCallback((props) => {
    const { users, type } = props;
    return users[0] ? users.map((value, idx) => {
      if(idx === 2 && windowSize > browserSize) {
        return <TodayUserText key={idx}>외 {users.length - idx}명</TodayUserText>
      }
      if(idx > 2 && windowSize > browserSize) {
        return null;
      }
      if(windowSize > browserSize) {
        return <TodayUserText key={idx}>{value}</TodayUserText>
      } else {
        if(idx === 0) {
          return <TodayUserText key={idx} onClick={() => console.log(type)}>
            {users.length}명
            <Arrow />
          </TodayUserText>
        } else {
          return null;
        }
      }
    })
    :
    <TodayUserText>없음</TodayUserText>
  }, [windowSize]);

  return (
    <AnimatedWrapper>
      <TopWrapper>
        <TopLayout>
          <TopText>{dummyName}{topText}</TopText>
          <TopIcon src="/img/calendar/main.png" alt="icon" />
        </TopLayout>
        <TopTodayLane>
          <TodayTextLayout>
            <TodayText>{todayTardyText}</TodayText>
            <DisplayUser users={dummy1} type="tardy"/>
          </TodayTextLayout>
          <TodayTextLayout>
            <TodayText>{todayHolidayText}</TodayText>
            <DisplayUser users={dummy2} type="holiday"/>
          </TodayTextLayout>
        </TopTodayLane>
        <TuiCalendar />
      </TopWrapper>
      <BackgroundContainer />
    </AnimatedWrapper>
  );
}

export default CalendarPage;