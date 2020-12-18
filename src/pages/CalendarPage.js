import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import { TuiCalendar } from '../components/Tui';
import { AnimatedWrapper } from '../components/PageAnim';
import moment from 'moment';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;

  @media (max-width: 375px) {
    padding: 16px;
  }
`;

const Cloud1 = styled.img`
  top: 10px;
  right: 30px;
  object-fit: contain;
  position: absolute;
`;
const Cloud2 = styled.img`
  top: 80px;
  right: 52%;
  object-fit: contain;
  position: absolute;
`;
const Cloud3 = styled.img`
  top: 170px;
  right: 120px;
  object-fit: contain;
  position: absolute;
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

const ImgWrapper = styled.div`
  margin-top: 41px;
  position: relative;
`;

const GuideImg = styled.img`
  right: 0px;
  bottom: 0px;
  position: absolute;
  object-fit: contain;
`;

const GroundImg = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: -5px;
`;

const AppleImg = styled.img`
  left: 2%;
  bottom: 7px;
  position: absolute;
  transition: transform ease 1s 0s;

  &:active {
    transform: scale(1.2);
  }
`;

const AnimalImg = styled.img`
  right: 150px;
  bottom: 7px;
  position: absolute;
  transition: transform ease 1s 0s;
  
  &:active {
    transform: translate(-50px, 0px);
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  min-height: 170px;
  height:calc(100% - 170px);
  background-color: #faefe0;
`;

const CardBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 169px;
  height: 110px;
  margin: 10px;
  padding-left: 27px;
  border-top-right-radius: 19px;
  border-bottom-right-radius: 19px;
  background-color: white;
  position: relative;
  cursor: pointer;
  transition: transform ease 0.3s 0s;

  &:hover {
    transform: scale(1.1);
  }
`;

const CardLine = styled.div`
  width: 11px;
  height: 110px;
  top: 0px;
  left: 0px;
  background-color: ${props => props.line || "#d6ff98"};
  position: absolute;
`;

const CardTitle = styled.span`
  width: 55%;
  margin-top: 16px;
  font-family: NanumBarunGothic;
  font-size: 16px;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CardIcons = styled.img`
  width: 31px;
  height: 31px;
  object-fit: contain;
  top: 10px;
  right: ${props => props.right || "10"}px;
  position: absolute;
`;

const CardMembers = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CardMember = styled.span`
  margin-top: 18px;
  margin-right: 5px;
  font-family: NanumBarunGothic;
  font-size: 16px;
  font-weight: bold;
  color: #000000;
`;

const CardTime = styled.span`
  margin-top: 7px;
  font-family: NanumBarunGothic;
  font-size: 15px;
  color: #777777;
  left: 27px;
  bottom: 15px;
  position: absolute;
`;

const EmptyText = styled.span`
  font-family: NanumBarunGothic;
  font-size: 15px;
  color: black;
`;

const dummyName = `더미`;
const topText = `, 좋은아침!\n9시 45분에 출근하셨네요`;
const todayTardyText = `지각자`;
const todayHolidayText = `휴가자`;
const emptyTask = `오늘의 일정이 없습니다.`;

const dummy1 = ["더미", "더미", "더미"];
const dummy2 = ["더미", "더미"];
const browserSize = 375;

const cardDummy = [
  { id: 0, title: "강남 출장 있습니다.", participation: [{ name: "더미", tag: "design" }], start: new Date(), end: new Date(), text: "", category: "출장" },
  { id: 1, title: "전략기획팀 회의 있습니다.", participation: [{ name: "더미", tag: "developer" }, { name: "더미", tag: "manager" }, { name: "더미", tag: "design" }], start: new Date(), end: new Date(), text: "", category: "희의" },
  { id: 2, title: "해피 버스데이!", participation: [{ name: "더미", tag: "marketing" }], start: new Date(), end: new Date(), text: "", category: "생일" },
  { id: 3, title: "오늘은 재택 근무입니다.", participation: [{ name: "더미", tag: "developer" }], start: new Date(), end: new Date(), text: "", category: "출장" },
];

// const cardColor = [
//   "#d6ff98", "#87dffa", "#b0c0ff"
// ];

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

  const CardItems = useCallback((value) => {
    const { title, participation, start, end } = value;
    return <CardBox>
      <CardLine />
      <CardTitle>{title}</CardTitle>
      {
        participation.map((mem, idx) => {
          const userIcon = mem.tag === "developer" ? "1" : "2";
          const right = !idx ? 0 : 25;
          if(idx > 1) {
            return null;
          }
          return <CardIcons key={idx} src={`/img/calendar/cardImg${userIcon}.png`} alt="icon" right={right}/>
        })
      }
      <CardMembers>
        {
          participation.map((mem, idx) => {
            const comma = participation[idx + 1] ? true : false;
            if(idx === 2) {
              return <CardMember key={idx}> 외 {participation.length - idx}명</CardMember>
            }
            if(idx > 1) {
              return null;
            }
            return <CardMember key={idx}>{mem.name}{(comma && idx !== 1) && ","}</CardMember>
          })
        }
      </CardMembers>
      <CardTime>{moment(start).format("M.D(ddd)")}{end && ` ~ ${moment(end).format("M.D(ddd)")}`}</CardTime>
    </CardBox>
  }, []);

  return (
    <AnimatedWrapper>
      <Container>
        <Cloud1 src="/img/calendar/cloud1.png" alt="cloud"/>
        <Cloud2 src="/img/calendar/cloud2.png" alt="cloud"/>
        <Cloud3 src="/img/calendar/cloud3.png" alt="cloud"/>
        <TopWrapper>
          <TopLayout>
            <TopText>{dummyName}{topText}</TopText>
            <TopIcon src="/img/calendar/main.png" alt="icon"/>
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
        <ImgWrapper>
          <GuideImg src="/img/calendar/guide.png" alt="img"/>
          <AppleImg src="/img/calendar/background3.png" alt="img"/>
          <AnimalImg src="/img/calendar/background1.png" alt="img"/>
          <GroundImg src="/img/calendar/background2.png" alt="img"/>
        </ImgWrapper>
        <CardContainer>
          {
            cardDummy[0] ? cardDummy.map(value => {
              return <CardItems 
                key={value.id}
                {...value}
              />
            })
            :
            <EmptyText>{emptyTask}</EmptyText>
          }
        </CardContainer>
      </Container>
    </AnimatedWrapper>
  );
}

export default CalendarPage;