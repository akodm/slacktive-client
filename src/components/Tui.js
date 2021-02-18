import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../actions/modal';
import CalendarModal from '../components/Calendar';
import { calendarInit } from '../actions/calendar';
import { requestAxios } from '../util/request';

const Container = styled.div`
  height: 80vmin;
  min-height: 610px;
  background-color: gray;
  margin-top: 18px;
`;

const MonthButtonLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
`;

const BtnTextLayout = styled.div`
  display: flex;
  flex-direction: ${props => props.layout ? "row-reverse" : "row"};
  align-items: center;
  color: white;
  cursor: pointer;
  transition: transform ease 0.2s 0s;

  &:active {
    transform: scale(1.2);
  }
`;

const BtnText= styled.div`
  font-family: 12LotteMartDream;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
`;

const TodayDate = styled.span`
  font-family: NanumBarunGothic;
`;

const PreviousBtn = styled(ChevronLeftOutlinedIcon)`
  margin-bottom: 3px;
`;

const NextBtn = styled(ChevronRightOutlinedIcon)`
  margin-bottom: 2px;
`

const now = moment(new Date());
const monthView = ['일', '월', '화', '수', '목', '금', '토'];
const calendarModalOptions = { width: 570, height: 944, backdrop: true };

const Tui = () => {
  const dispatch = useDispatch();
  const [ month, setMonth ] = useState(now);
  const calendarRef = useRef();
  const openModalAction = useCallback((payload) => dispatch(openModal(payload)), [dispatch]);
  const calendarInitAction = useCallback((payload) => dispatch(calendarInit(payload)), [dispatch]);
  const { schedules } = useSelector(state => state.calendarEventReducer);

  // 데이터를 캘린더에 사용할 수 있도록 파싱.
  const scheduleParser = useCallback((array, type) => {
    return array.map((data) => {
      if(type === "휴가") {
        return {
          ...data,
          calendarId: "98",
          title: data.text,
          body: data.count,
          bgColor: "yellow",
          category: "time",
          isAllDay: !/반차/.test(data.category),
        }
      }

      return { 
        ...data, 
        calendarId: "99", 
        body: data.text, 
        bgColor: "yellow", 
        category: "time",
        isAllDay: false,
      };
    });
  }, []);

  // 초기 캘린더 스케쥴 데이터 이닛.
  const initSchedule = useCallback( async () => {
    try {
      const { response, result, status, message } = await requestAxios({ method: "get", url: `/holiday/all` });
    
      if(!result || status === 500) {
        throw new Error(message);
      }

      /**
       * 일정 관련 데이터도 가져오기.
       * 휴가 관련 데이터와 합치기.
       */

      const parseItem = scheduleParser(response.data, "휴가");

      calendarInitAction(parseItem);
    } catch(err) {
      console.log(err);
      window.alert(err.message || err);
    }
  }, [calendarInitAction, scheduleParser]);

  // 초기 캘린더 데이터 이펙트.
  useEffect(() => {
    initSchedule();
  }, [initSchedule]);

  // 월 변경.
  const monthChange = useCallback((type) => {
    const calendar = calendarRef.current?.getInstance();
    if(type) {
      setMonth(moment(month, "M").add(1, "month"));
      calendar.next();
    } else {
      setMonth(moment(month, "M").subtract(1, "month"));
      calendar.prev();
    }
  }, [calendarRef, month]);

  // 현재 월로 이동.
  const monthToday = useCallback(() => {
    const calendar = calendarRef.current?.getInstance();
    setMonth(now);
    calendar.today();
  }, [calendarRef]);

  // 월 변경 버튼들.
  const btns = useMemo(() => [
    { key: "pre", icon: <PreviousBtn />, text: "이전 달", onClick: () => monthChange(false) },
    { key: "today", icon: <TodayDate />, text: `${month.format("YYYY년 M월")}`, onClick: monthToday },
    { key: "next", icon: <NextBtn />, text: "다음 달", onClick: () => monthChange(true) },
  ], [monthChange, month, monthToday]);

  // 일정 생성.
  const createSchedule = useCallback(({ start, end, isAllDay }) => {
    openModalAction({ 
      contents: <CalendarModal 
        value={{ 
          start: start._date, 
          end: end._date, 
          isAllDay,
        }} 
      />, 
      ...calendarModalOptions 
    });
  }, [openModalAction]);

  // 일정 수정.
  const updateSchedule = useCallback(() => {
    console.log("update Schedule");

    // 일정 클릭 -> 모달 오픈 및 모달내에서 수정 -> 확인 및 업데이트 완료 시 호출.
  }, []);

  // 일정 삭제.
  // const deleteSchedule = useCallback(() => {
  //   console.log("delete Schedule");
    // 일정 클릭 -> 모달 오픈 및 수정/삭제 중 -> 삭제 클릭 시 호출.
  // }, []);

  // 일정 클릭.
  const clickSchedule = useCallback((e) => {
    const selectItem = schedules.reduce((first, data) => {
      if(data.id === e.schedule.id) {
        return { ...data };
      }

      return first;
    }, {});

    openModalAction({ contents: <CalendarModal value={{
      ...selectItem
    }} />, ...calendarModalOptions });
  }, [openModalAction, schedules]);

  return (
    <>
      <MonthButtonLayout>
        {
          btns.map((value, idx) => {
            return <BtnTextLayout layout={idx !== 0 && true} key={value.key} onClick={value.onClick}>
              { value.icon }
              <BtnText>{value.text}</BtnText>
            </BtnTextLayout>
          })
        }
      </MonthButtonLayout>
      <Container>
        <Calendar 
          height="100%"
          schedules={schedules}
          ref={calendarRef}
          disableDblClick
          disableClick={false}
          isReadOnly={false}
          timezones={[
            {
              timezoneOffset: 540,
              displayLabel: 'GMT+09:00',
              tooltip: 'Seoul'
            }
          ]}
          useCreationPopup={false}
          useDetailPopup={false}
          view={"month"}
          month={{
            daynames: monthView,
            narrowWeekend : true,
            isAlways6Week : true
          }}
          onBeforeCreateSchedule={createSchedule}
          onBeforeUpdateSchedule={updateSchedule}
          onClickSchedule={clickSchedule}
        />
      </Container>
    </>
  );
}

export const TuiCalendar = React.memo(Tui);