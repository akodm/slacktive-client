import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { AnimatedWrapper } from '../components/PageAnim';
import axios from 'axios';

import { SERVER_URL } from '../config';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  ailgn-items: center;
  width: 100%;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SelectCards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 80px;
  margin: 15px;
  padding: 20px;
  border-radius: 12px;
  opacity: 0.7;
  background-color: ${props => props.colors || "red"};
  cursor: pointer;
  transition-property: transform;
  transition: ease 0.3s 0s;

  &:hover {
    transform: scale(1.05);
  }
`;

const SelectText = styled.span`
  font-family: 12LotteMartDream;
  font-size: calc(10px + 1vmin);
  font-weight: 500;
  color: ${props => props.fontColor || "white"};
`;

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0px;
  right: 0px;
  width: 100vw;
  height: 100%;
  position: absolute;
  z-index: 1000;
`;

const ModalOverray = styled.div`
  width: 100%;
  height: 100%;
  background-color: gray;
  opacity: 0.6;
  position: absolute;
  z-index: 1001;
`;

const animModal = keyframes`
  from {
    margin-top: 100px;
    opacity: 0;
  }

  to {
    margin-top: 0px;
    opacity: 1;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 500px;
  padding: 20px;
  border-radius: 8px;
  background-color: white;
  position: absolute;
  overflow: auto;
  z-index: 1002;

  animation-name: ${animModal};
  animation-duration: 0.5s;

  @media (max-width: 600px) {
    width: 95%;
    height: 95%;
  }
`;

const ModalText = styled.span`
  font-family: 12LotteMartDream;
  font-size: calc(5px + 1vmin);
  font-weight: 500;
  color: black;
`;

const ModalTr = styled.tr`
  border-bottom: 1px solid gray;
`;

const Develop = () => {
  const [ times, setTimes ] = useState([]);         // 모든 출퇴근 내역.
  const [ holidays, setHolidays ] = useState([]);   // 모든 휴가 내역.
  const [ avgTimes, setAvgTimes ] = useState([]);   // 모든 사용자들의 평균 출퇴근 내역.
  const [ overs, setOvers ] = useState([]);         // 모든 사용자들의 야근 내역.
  const [ tardys, setTardys ] = useState([]);       // 모든 사용자들의 지각 내역.
  const [ modal, setModal ] = useState(false);
  const [ modalContent, setModalContent ] = useState([]);

  const getApis = async () => {
    try {
      let time = axios.get(`${SERVER_URL}/commute/all`);
      let holiday = axios.get(`${SERVER_URL}/holiday/all`);
      let over = axios.get(`${SERVER_URL}/commute/all/category?category=${"퇴근"}`);
      let tardy = axios.get(`${SERVER_URL}/commute/all/category?category=${"지각"}`);

      await Promise.all([time, holiday, over, tardy]).then(result => {
        time = result[0].data;
        holiday = result[1].data;
        over = result[2].data;
        tardy = result[3].data;
      });

      if(time.err || holiday.err || over.err || tardy.err) {
        throw new Error("api request failed: " + time.message + " " + holiday.message + " " + over.message + " " + tardy.message);
      }

      setTimes(time.data);
      setHolidays(holiday.data);
      setAvgTimes([]);
      setOvers(over.data);
      setTardys(tardy.data);
    } catch(err) {
      window.alert("API failed: " + err.message || err);
      return;
    }
  };

  useEffect(() => {
    getApis();
  }, []);

  const onClickModalContent = useCallback((category) => {
    switch(category) {
      case "times": setModalContent(times); break;
      case "holidays": setModalContent(holidays); break;
      case "avgTimes": setModalContent(avgTimes); break;
      case "overs": setModalContent(overs); break;
      case "tardys": setModalContent(tardys); break;
      default: break;
    }

    setModal(true);
  }, [setModal, times, holidays, avgTimes, overs, tardys]);

  const cards = useMemo(() => [
    { id: "times", title: "현재까지 모든 출퇴근 기록", onClick: () => onClickModalContent("times"), colors: "red", fontColor: "white" },
    { id: "holidays", title: "현재까지 모든 휴가 기록", onClick: () => onClickModalContent("holidays"), colors: "blue", fontColor: "white" },
    { id: "avgTimes", title: "현재까지 모든 출퇴근 평균 기록 (사용 불가)", onClick: () => onClickModalContent("avgTimes"), colors: "yellow", fontColor: "black" },
    { id: "overs", title: "현재까지 모든 야근 기록", onClick: () => onClickModalContent("overs"), colors: "green", fontColor: "white" },
    { id: "tardys", title: "현재까지 모든 지각 기록", onClick: () => onClickModalContent("tardys"), colors: "purple", fontColor: "white" },
  ], [onClickModalContent]);

  const Cards = useCallback(() => {
    return cards.map((data, idx) => {
      return <SelectCards colors={data.colors} key={idx} onClick={data.onClick}>
        <SelectText fontColor={data.fontColor}>{data.title}</SelectText>
      </SelectCards>
    });
  }, [cards]);

  return (
    <AnimatedWrapper>
      <Container>
        <SelectContainer>
          <Cards />
        </SelectContainer>
        { modal && <DummyModal category={modalContent} close={setModal} /> }
      </Container>
    </AnimatedWrapper>
  );
}

const DummyModal = (props) => {
  const { category, close } = props;

  const modalClose = useCallback(() => {
    close && close(false);
  }, [close]);

  const overParse = useCallback((time) => {
    const [ hour, minute ] = time.toString().split('.');

    let parseMinute = 0;

    if(minute) {
      parseMinute = ((60 * parseInt(minute)) / 100).toFixed(0);
    }
    
    const parseTime = `${parseInt(hour) > 0 ? `${hour}시간` : ""} ${parseMinute}분`;

    return parseTime;
  }, []);

  return <ModalContainer onClick={modalClose}>
    <ModalOverray />
      <ModalContent>
        <table>
          <tbody>
            {
              category[0] ? category.map((data, idx) => {
                return <ModalTr key={idx}>
                  <td><ModalText>{data.id}</ModalText></td>
                  <td><ModalText>{data.text}</ModalText></td>
                  <td><ModalText>{data.user?.name}</ModalText></td>
                  <td><ModalText>{data.slackTime || `${data.start} ~ ${data.end}`}</ModalText></td>
                  { data.category ? <td><ModalText>{data.category}</ModalText></td> : <td></td> }
                  { data.count ? <td><ModalText>{`${data.count}개 사용`}</ModalText></td> : <td></td> }
                  { data.over ? <td><ModalText>{`${overParse(data.over)} 야근`}</ModalText></td> : <td></td> }
                </ModalTr>
              })
              :
              <tr>
                <td>
                  <ModalText>해당 기록이 없습니다.</ModalText>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </ModalContent>
  </ModalContainer>
};

export default Develop;