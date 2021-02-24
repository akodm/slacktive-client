import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../actions/modal';
import CalendarModal from '../components/Calendar';
import ConfirmModal from '../components/Confirm';
import { openAlert } from '../actions/alert';
import { calendarInit, calendarDelete, calendarAdd, calendarUpdate } from '../actions/calendar';
import { loadmaskOff, loadmaskOn } from '../actions/loadmask';
import { requestAxios } from '../util/request';
import { LOCALSTORAGE, HOLIDAY_CHANNEL } from '../config';

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
const category = [
  { select: "1", text: "출장/미팅", colors: "#d6ff98" },
  { select: "2", text: "휴가", colors: "#FFEB3B" },
  { select: "3", text: "회의", colors: "#87dffa" },
  { select: "4", text: "생일", colors: "#b0c0ff" },
  { select: "5", text: "기타", colors: "#ff98c3" },
];

/**
 * calendarId => 98: 휴가, 99: 일정.
 */

// 토큰 반환.
const tokenReturn = () => {
  const local = window.localStorage.getItem(LOCALSTORAGE);

  const { token, result } = JSON.parse(local);

  return {
    token,
    result
  };
};

const Tui = () => {
  const dispatch = useDispatch();
  const [ month, setMonth ] = useState(now);
  const calendarRef = useRef();
  const openAlertAction = useCallback((payload) => dispatch(openAlert(payload)), [dispatch]);
  const closeModalAction = useCallback(() => dispatch(closeModal()), [dispatch]);
  const openModalAction = useCallback((payload) => dispatch(openModal(payload)), [dispatch]);
  const calendarInitAction = useCallback((payload) => dispatch(calendarInit(payload)), [dispatch]);
  const calendarAddAction = useCallback((payload) => dispatch(calendarAdd(payload)), [dispatch]);
  const calendarUpdateAction = useCallback((payload) => dispatch(calendarUpdate(payload)), [dispatch]);
  const calendarDeleteAction = useCallback((payload) => dispatch(calendarDelete(payload)), [dispatch]);
  const loadmaskOnAction = useCallback(() => dispatch(loadmaskOn()), [dispatch]);
  const loadmaskOffAction = useCallback(() => dispatch(loadmaskOff()), [dispatch]);
  const { schedules } = useSelector(state => state.calendarEventReducer);

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
      const { response, result, status, message } = await requestAxios({ method: "get", url: `/holiday/all` });
      const { response: taskResponse, result: taskResult, status: taskStatus, message: taskMessage } = await requestAxios({ method: "get", url: `/task/all` });

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

  // 휴가 채널에 메시지 보내기.
  const messagePostHolidayChannel = useCallback( async (data) => {
    try {
      loadmaskOnAction();

      const { token } = tokenReturn();

      const startEndDate = data.startIsEnd ? moment(data.start).format("YYYY년 MM월 DD일") :
      moment(data.start).format("YYYY년 MM월 DD일") + " ~ " + moment(data.end).format("YYYY년 MM월 DD일");
     
      const titleExp = /.*(휴가|병가|오전\s*반차|오후\s*반차|대휴|연차)/;
      const titleValidation = titleExp.exec(data.title);

      if(!titleValidation || !titleValidation[1] || !titleExp.test(data.title)) {
        throw new Error("제목에 내용만 입력해주세요. 예) 휴가");
      }

      const { response, result, status, message } = await requestAxios({ 
        method: "post", 
        url: `/api/message/post`, 
        headers: {
          "authorization": token
        }, 
        data: {
          text: `[준명] ${startEndDate} ${titleValidation[1]}`,
          channel: HOLIDAY_CHANNEL,
          as_user: true
        }
      });

      if(!result || status === 500) {
        throw new Error(message);
      }

      return {
        response,
        result,
        message
      }
    } catch(err) {
      return {
        err: true,
        message: err.message || err
      };
    }
  }, [loadmaskOnAction]);

  // 일정 서버 코드.
  const taskProcess = useCallback( async (data, method, url) => {
    try {
      loadmaskOnAction();

      const { response, result, status, message } = await requestAxios({ 
        method,
        url,
        data: {
          ...data,
          start: moment(data.start).format("YYYY-MM-DD HH:mm"),
          end: moment(data.end).format("YYYY-MM-DD HH:mm"),
        }
      });

      if(!result || status === 500) {
        throw new Error(message);
      }

      return {
        response,
        result,
      }
    } catch(err) {
      return {
        err: true,
        message: err.message || err
      };
    }
  }, [loadmaskOnAction]);

  // 일정 생성.
  const createSchedule = useCallback( async (data) => {
    try {
      let item = null;

      if(data.category === "휴가") {
        const { result, message } = await messagePostHolidayChannel(data);

        if(!result) {
          throw new Error(message);
        }

        /**
         * 소켓 on 이벤트로 데이터 받아와서 반영.
         */

        // item = scheduleParser({ ...response.result })[0];
      } else {
        const { result, message, response } = await taskProcess(data, "post", "/task/add/one");

        if(!result) {
          throw new Error(message);
        }

        item = scheduleParser({ ...response.data })[0];
      }

      item && calendarAddAction(item);
      loadmaskOffAction();
      closeModalAction();
      openAlertAction("일정이 생성되었습니다.");
    } catch(err) {
      console.log(err.message || err);
      loadmaskOffAction();
      closeModalAction();
      openAlertAction("일정 생성에 실패하였습니다. " + err.message || err);
    }
  }, [closeModalAction, openAlertAction, messagePostHolidayChannel, loadmaskOffAction, taskProcess, scheduleParser, calendarAddAction]);

  // 일정 수정.
  const updateSchedule = useCallback( async (e) => {
    try {
      const newItem = schedules.map(data => {
        if(data.id === e.id && data.calendarId === e.calendarId) {
          return { ...scheduleParser(e)[0] };
        }
        return { ...data };
      });
  
      if(e.calendarId === "98") {
        // 휴가 처리...
        // 휴가의 경우 실제 채널에서 메시지가 수정됨을 인지시켜주기.
      }
  
      if(e.calendarId === "99") {
        const { result, message } = await taskProcess(e, "put", "/task/update/one");
      
        if(!result) {
          throw new Error(message);
        }
      }
  
      calendarUpdateAction(newItem)
      loadmaskOffAction();
      closeModalAction();
      openAlertAction("일정이 수정되었습니다.");
    } catch(err) {
      console.log(err.message || err);
      loadmaskOffAction();
      closeModalAction();
      openAlertAction("정상 처리 되지 않았습니다. " + err.message || err);
    }
  }, [loadmaskOffAction, openAlertAction, closeModalAction, calendarUpdateAction, schedules, scheduleParser, taskProcess]);

  // 일정 삭제.
  const deleteSchedule = useCallback( async (e) => {
    try {
      if(e.calendarId === "98") {
        // 휴가 삭제 처리...
        // 휴가의 경우 실제 채널에서 메시지가 삭제됨을 인지시켜주기.
      }
  
      if(e.calendarId === "99") {
        const { result, message } = await taskProcess(e, "delete", `/task/delete/one?id=${e.id}`);
        
          if(!result) {
            throw new Error(message);
          }
      }
  
      calendarDeleteAction(e);
      loadmaskOffAction();
      closeModalAction();
      openAlertAction("일정이 삭제되었습니다.");
    } catch(err) {
      console.log(err.message |err);
      loadmaskOffAction();
      closeModalAction();
      openAlertAction("일정이 삭제되었습니다.");
    }
  }, [calendarDeleteAction, closeModalAction, openAlertAction, taskProcess, loadmaskOffAction]);

  // 일정 생성 팝업 오픈.
  const createPopup = useCallback(({ start, end, isAllDay }) => {
    openModalAction({ 
      contents: <CalendarModal 
        value={{ 
          start: start._date, 
          end: end._date, 
          isAllDay,
        }} 
        createSchedule={createSchedule}
      />, 
      ...calendarModalOptions 
    });
  }, [openModalAction, createSchedule]);

  // 일정 수정 팝업 오픈.
  const updatePopup = useCallback((e) => {
    openModalAction({ 
      contents: <CalendarModal 
        value={{ 
          ...e
        }} 
        edit
        updateSchedule={updateSchedule}
      />, 
      ...calendarModalOptions 
    });
  }, [openModalAction, updateSchedule]);

  // 일정 클릭 및 팝업 오픈.
  const clickSchedule = useCallback((e) => {
    const selectItem = schedules.reduce((first, data) => {
      if(data.id === e.schedule.id && data.calendarId === e.schedule.calendarId) {
        return { ...data };
      }

      return first;
    }, {});

    openModalAction({ 
      contents: <ConfirmModal 
        value={{
          ...selectItem,
        }}
        deleteSchedule={deleteSchedule} 
        updatePopup={updatePopup}
      />, 
      ...calendarModalOptions, 
      height: 641
    });
  }, [openModalAction, schedules, deleteSchedule, updatePopup]);

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
          onBeforeCreateSchedule={createPopup}
          onClickSchedule={clickSchedule}
        />
      </Container>
    </>
  );
}

export const TuiCalendar = React.memo(Tui);