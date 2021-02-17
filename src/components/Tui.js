import React, { useState, useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components';
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { openModal } from '../actions/modal';
import CalendarModal from '../components/Calendar';

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
    const startDate = moment(start._date).format("YYYY-MM-DD ddd HH:mm:ss");
    const endDate = moment(end._date).format("YYYY-MM-DD ddd HH:mm:ss");
    openModalAction({ 
      contents: <CalendarModal value={{ 
        start: startDate, 
        end: endDate, 
        isAllDay 
      }} />, 
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
    console.log(e);
    openModalAction({ contents: <CalendarModal />, ...calendarModalOptions });
  }, [openModalAction]);

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
          schedules={[]}  // redux state
          height="100%"
          ref={calendarRef}
          disableDblClick={true}
          disableClick={false}
          isReadOnly={false}
          timezones={[
            {
              timezoneOffset: 540,
              displayLabel: 'GMT+09:00',
              tooltip: 'Seoul'
            }
          ]}
          useDetailPopup={false}
          useCreationPopup={false}
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