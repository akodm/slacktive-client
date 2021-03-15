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
import { requestAxios } from '../util/request';
import UsersModal from '../components/Users';

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

  &:hover {
    transform: scale(1.2);
  }
`;

const AnimalImg = styled.img`
  right: 150px;
  bottom: 7px;
  position: absolute;
  transition: transform ease 1s 0s;
  
  &:hover {
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

const topText = `, 좋은 아침!\n아직 출근 전이시군요.`;
const todayTardyText = `지각자`;
const todayHolidayText = `휴가자`;
const emptyTask = `오늘의 일정이 없습니다.`;

const browserSize = 467;

const cardColors = [
  { text: "출장/미팅", colors: "#d6ff98" },
  { text: "휴가", colors: "#FFEB3B" },
  { text: "회의", colors: "#87dffa" },
  { text: "생일", colors: "#b0c0ff" },
  { text: "기타", colors: "#ff98c3" },
];

const calendarModalOptions = { width: 570, height: 944, backdrop: true };

// 유저 이미지들.
const userImgs = [
  { tag: "개발", img: "/img/calendar/cardImg1.png" },
  { tag: "디자인", img: "/img/calendar/cardImg2.png" },
];

// 시간대별 텍스트.
const timeAndText = () => {
  const now = moment(new Date()).format("YYYY-MM-DD HH:mm");
  const date = moment(new Date(), "YYYY-MM-DD HH:mm").format("YYYY-MM-DD");
  const MONING_STANDARD = `${date} 12:00`;
  const RUNCH_STANDARD = `${date} 17:00`;
  const NIGHT_STANDARD = `${date} 23:59`;
  let text = "";

  if(moment(now).isBefore(NIGHT_STANDARD)) {
    text = "좋은 밤!";
  }

  if(moment(now).isBefore(RUNCH_STANDARD)) {
    text = "좋은 오후!";
  }

  if(moment(now).isBefore(MONING_STANDARD)) {
    text = "좋은 아침!";
  }

  return text;
};

function CalendarPage(props) {
  const dispatch = useDispatch();
  const [ windowSize, setWindowSize ] = useState(window.innerWidth);
  const openAlertAction = useCallback((payload) => dispatch(openAlert(payload)), [dispatch]);
  const openModalAction = useCallback((payload) => dispatch(openModal(payload)), [dispatch]);
  const { schedules } = useSelector(state => state.calendarEventReducer);
  const { user } = useSelector(state => state.slackLoginReducer);
  const [ title, setTitle ] = useState(topText);
  const [ tardys, setTardys ] = useState([]);
  const [ holidays, setHolidays ] = useState([]);

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

  // 유저 확인 모달 오픈.
  const usersModalOpen = useCallback((users, type) => {
    const title = type === "tardy" ? "지각자" : "휴가자";

    openModalAction({
      contents: <UsersModal 
        title={title}
        users={users}
      />,
      ...calendarModalOptions
    });
  }, [openModalAction]);

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
        return <TodayUserText key={idx}>{value.user?.name || "???"}</TodayUserText>
      } else {
        if(idx === 0) {
          return <TodayUserText key={idx} onClick={() => usersModalOpen(users, type)}>
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
  }, [windowSize, usersModalOpen]);

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
  // props.user.name + (participation.length ? ", " : "") => 본인 자동 포함하고 싶을 경우.
  const CardItems = useCallback((value) => {
    const { title, participation, start, end, type } = value;
    let members = "";
    const lineColor = cardColors.reduce((first, data) => {
      if(data.text === type) {
        return data.colors;
      }

      return first;
    }, "#d6ff98");

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
      <CardLine line={lineColor} />
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

  // 출근 시각 가져오기.
  const userCommuteTime = useCallback( async () => {
    try {
      const { response, result, status, message } = await requestAxios({ method: "get", url: `/commute/atten/time?date=${moment(new Date()).format("YYYY-MM-DD")}&slackId=${user.slackId}`});

      if(!result || status === 500) {
        throw new Error(message);
      }

      if(moment(new Date(), "YYYY-MM-DD").format("ddd") === "토" || moment(new Date(), "YYYY-MM-DD").format("ddd") === "일" || response.moment) {
        setTitle(`, ${timeAndText()}\n오늘은 휴일이군요!`);
        return;
      }

      if(response.data && response.data[0]) {
        const time = moment(response.data[0].slackTime, "YYYY-MM-DD HH:mm").format("HH시 mm분");

        if(/출근|지각|외근/.test(response.data[0].category)) {
          setTitle(`, ${timeAndText()}\n${time}에 출근하셨습니다.`);
        }

        if(/퇴근/.test(response.data[0].category)) {
          setTitle(`, ${timeAndText()}\n${time}에 퇴근하셨습니다.`);
        }
      } else {
        setTitle(`, ${timeAndText()}\n아직 출근 전이시군요..?`);
      }

      if(response.holiday) {
        setTitle(`, ${timeAndText()}\n오늘은 휴가시군요!`);
      }
    } catch(err) {
      console.log(err);
      window.alert(err.message || err);
    }
  }, [user]);

  // 지각자 데이터 가져오기.
  const tardyDataInit = useCallback( async () => {
    try {
      const { response, result, status, message } = await requestAxios({ method: "get", url: `/commute/tardy/time?date=${moment(new Date()).format("YYYY-MM-DD")}`});

      if(!result || status === 500) {
        throw new Error(message);
      }

      setTardys(response.data);
    } catch(err) {
      console.log(err);
      window.alert(err.message || err);
    }
  }, []);

  // 휴가자 데이터 가져오기.
  const holidayDataInit = useCallback( async () => {
    try {
      const { response, result, status, message } = await requestAxios({ method: "get", url: `/holiday/all/time?date=${moment(new Date()).format("YYYY-MM-DD")}` });
      
      if(!result || status === 500) {
        throw new Error(message);
      }

      setHolidays(response.data);
    } catch(err) {
      console.log(err);
      window.alert(err.message || err);
    }
  }, []);

  // 초기 데이터 가져오기.
  useEffect(() => {
    user.slackId && userCommuteTime();
    user.slackId && tardyDataInit();
    user.slackId && holidayDataInit();
  }, [user, userCommuteTime, tardyDataInit, holidayDataInit]);

  return (
    <AnimatedWrapper>
      <Container>
        <Cloud1 src="/img/calendar/cloud1.png" alt="cloud"/>
        <Cloud2 src="/img/calendar/cloud2.png" alt="cloud"/>
        <Cloud3 src="/img/calendar/cloud3.png" alt="cloud"/>
        <TopWrapper>
          <TopLayout>
            <TopText onClick={() => openAlertAction("안녕하세요.")} >{`${user.name}님` || "???"}{title}</TopText>
            <TopIcon src="/img/calendar/main.png" alt="icon"/>
          </TopLayout>
          <TopTodayLane>
            <TodayTextLayout>
              <TodayText>{todayTardyText}</TodayText>
              <DisplayUser users={tardys} type="tardy"/>
            </TodayTextLayout>
            <TodayTextLayout>
              <TodayText>{todayHolidayText}</TodayText>
              <DisplayUser users={holidays} type="holiday"/>
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