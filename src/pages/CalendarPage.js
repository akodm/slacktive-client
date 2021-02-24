import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import { TuiCalendar } from '../components/Tui';
import { AnimatedWrapper } from '../components/PageAnim';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { openAlert } from '../actions/alert';
import ConfirmModal from '../components/Confirm';
import { openModal } from '../actions/modal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;

  @media (max-width: 950px) {
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

  @media (max-width: 950px) {
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
  cursor: pointer;
  transition-property: color, transform;
  transition: ease 0.5s 0s;

  &:hover {
    color: #80D8FF;
    transform: scale(1.1);
  }
`;

const TopIcon = styled.img`
  width: 85px;
  height: 85px;
  object-fit: cover;

  @media (max-width: 950px) {
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

  @media (max-width: 950px) {
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

  @media (max-width: 390px) {
    font-size: calc(4px + 1vmin);
    margin: 8px;
  }
`;

const TodayUserText = styled.span`
  font-family: 12LotteMartDream;
  font-size: calc(8px + 1vmin);
  font-weight: 500;
  color: #ffffff;
  margin: 5px;

  @media (max-width: 390px) {
    font-size: calc(3px + 1vmin);
    margin: 1px;
  }

  @media (max-width: 500px) {
    display: flex;
    align-items: center;
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
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1 0 auto;
  overflow-x: scroll;
  min-height: 170px;
  background-color: #faefe0;
  position: relative;
`;

const CardBox = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 169px;
  min-height: 110px;
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
  word-break: keep-all;
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

const EmptyText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
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
const browserSize = 467;

// const cardColor = [
//   "#d6ff98", "#87dffa", "#b0c0ff"
// ];

const calendarModalOptions = { width: 570, height: 944, backdrop: true };

// 유저 이미지들.
const userImgs = [
  { tag: "develop", img: "/img/calendar/cardImg1.png" },
  { tag: "design", img: "/img/calendar/cardImg2.png" },
];

function CalendarPage(props) {
  const dispatch = useDispatch();
  const [ windowSize, setWindowSize ] = useState(window.innerWidth);
  const openAlertAction = useCallback((payload) => dispatch(openAlert(payload)), [dispatch]);
  const { schedules } = useSelector(state => state.calendarEventReducer);
  const openModalAction = useCallback((payload) => dispatch(openModal(payload)), [dispatch]);

  // 브라우저 리사이즈.
  const browserHandler = useCallback((e) => {
    setWindowSize(window.innerWidth);
  }, []);

  // 브라우저 리사이즈 이벤트 등록.
  useEffect(() => {
    window.addEventListener('resize', browserHandler);

    return () => window.removeEventListener('resize', browserHandler);
  }, [browserHandler]);

  // 클릭시 일정 오픈.
  const clickSchedule = useCallback((e) => {
    openModalAction({ 
      contents: <ConfirmModal 
        value={{
          ...e,
        }}
        disabled
      />, 
      ...calendarModalOptions, 
      height: 641
    });
  }, [openModalAction]);

  // 유저 이미지 추출.
  const participationImg = useCallback((data) => {
    return userImgs.reduce((result, imgs) => {
      if(data.tag === imgs.tag) {
        return imgs.img;
      }

      return result;
    }, "/img/calendar/cardImg1.png");
  }, []);

  // 지각 혹은 휴가자 처리.
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

  // 카드 아이템 파싱.
  const CardItemParser = useCallback(() => {
    if(Array.isArray(schedules) && schedules[0]) {
      const parseItem = schedules.filter(data => {
        if(data.calendarId === "99" && moment(new Date()).isBetween(data.start, data.end, 'days', '[]')) {
          return true;
        }

        return false;
      });

      return parseItem[0] ? parseItem.map((data, idx) => {
        return <CardItems 
          key={idx}
          {...data}
        />
      })
      :
      <EmptyText>{emptyTask}</EmptyText>;
    } else {
      return <EmptyText>{emptyTask}</EmptyText>
    }
  }, [schedules]);

  // 카드 아이템.
  const CardItems = useCallback((value) => {
    const { title, participation, start, end } = value;
    // props.user.name + (participation.length ? ", " : "") => 본인 자동 포함하고 싶을 경우.
    let members = "";

    for(let idx = 0; idx < participation.length; idx++) {
      const comma = participation[idx + 1] ? true : false;
      if(idx === 2) {
        members += `외 ${participation.length - idx}명`;
      }
      if(idx > 1) {
        continue;
      }
      members += `${participation[idx].name}${(comma && idx !== 1) ? ", " : " "}`;
    }

    return <CardBox onClick={() => clickSchedule(value)}>
      <CardLine />
      <CardTitle>{title}</CardTitle>
      {
        participation.map((mem, idx) => {
          const userIcon = participationImg(mem);
          const right = !idx ? 0 : 25;
          if(idx > 1) {
            return null;
          }
          return <CardIcons key={idx} src={userIcon} alt="icon" right={right}/>
        })
      }
      <CardMembers>
        <CardMember>{members}</CardMember>
      </CardMembers>
      <CardTime>{moment(start).format("M.D(ddd)")}{end && ` ~ ${moment(end).format("M.D(ddd)")}`}</CardTime>
    </CardBox>
  }, [participationImg, clickSchedule]);

  return (
    <AnimatedWrapper>
      <Container>
        <Cloud1 src="/img/calendar/cloud1.png" alt="cloud"/>
        <Cloud2 src="/img/calendar/cloud2.png" alt="cloud"/>
        <Cloud3 src="/img/calendar/cloud3.png" alt="cloud"/>
        <TopWrapper>
          <TopLayout>
            <TopText onClick={() => openAlertAction("안녕하세요.")} >{dummyName}{topText}</TopText>
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
          <CardItemParser />
        </CardContainer>
      </Container>
    </AnimatedWrapper>
  );
}

export default CalendarPage;