import socketIO from 'socket.io-client';
import { onEvent } from './consts';
import { SERVER_URL } from '../config';

// 데이터를 캘린더에 사용할 수 있도록 파싱.
const scheduleParser = (array, type) => {
  let result = Array.isArray(array) ? array : [array];

  return result.map((data) => {
    return {
      ...data,
      calendarId: "98",
      title: data.text,
      body: data.count,
      bgColor: "#FFEB3B",
      type: data.category,
      category: "time",
      isAllDay: !/반차/.test(data.category),
    };
  });
};

export const initSocket = (param) => {
  const socket = socketIO.connect(SERVER_URL, {
    path: "/socket",
    transports: ["websocket"]
  });

  // 초기 로그인.
  socket.on(onEvent.HELLO_WORLD, (data) => {
    console.log(data);
  });

  // 스케쥴 생성.
  socket.on(onEvent.CALENDAR_ADD, (data) => {
    if(data) {
      const items = scheduleParser(data);

      items.forEach(values => {
        param?.calendarAdd({ ...values });
      });
    }
  });

  // 스케쥴 수정.
  socket.on(onEvent.CALENDAR_UPDATE, (data) => {
    if(data) {
      const items = scheduleParser(data);

      items.forEach(values => {
        param?.calendarUpdate({ ...values });
      });
    }
  });

  // 스케쥴 삭제.
  socket.on(onEvent.CALENDAR_DELETE, (data) => {
    if(data) {
      const items = scheduleParser(data);

      items.forEach(values => {
        param?.calendarDelete({ ...values });
      });
    }
  });

  return socket;
};