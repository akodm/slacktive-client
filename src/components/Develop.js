import React from 'react';
import styled from 'styled-components';

const Warpper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 10px;
  overflow: auto;
`;

const TitleLayout = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
  font-size: 12px;
`;

const Row = styled.div`
  padding: 10px;
  margin: 10px;
  border-bottom: 1px solid gray;
`;

const Text = styled.div`
  margin: 3px;
`;

const Develop = props => {
  const { workData = [], holidays = [] } = props;

  return (
    <Warpper>
      <TitleLayout>* 출/퇴근 데이터가 없는 것은 슬랙에 없기 때문입니다. *</TitleLayout>
      {
        workData[0] && workData.map((data, idx) => {
          return <Row key={idx}>
            <Text style={{ color: "gray" }}>근태 내역 순번: {idx + 1}</Text>
            <Text style={{ color: "red" }}>{data.on.id ? ("ID: " + data.on.id + " / 분류: " + data.on.category + " / 텍스트: " + data.on.text + " / 기록 시간: " + data.on.slackTime) : "출근 데이터 없음"}</Text>
            <Text style={{ color: "blue" }}>{data.off.id ? ("ID: " + data.off.id + " / 분류: " + data.off.category + " / 텍스트: " + data.off.text + " / 기록 시간: " + data.off.slackTime) : "퇴근 데이터 없음."}</Text>
            <Text style={{ color: "blue" }}>{"상세 시간: " + data.time + " / 반차 여부: " + data.half}</Text>
          </Row>
        })
      }
      {
        holidays[0] && holidays.map((data, idx) => {
          return <Row key={idx}>
            <Text style={{ color: "gray" }}>휴가 내역 순번: {idx + 1}</Text>
            <Text style={{ color: "red" }}>{"ID: " + data.id + " / 분류: " + data.category + " / 텍스트: " + data.text}</Text>
            <Text style={{ color: "green" }}>{"시작일: " + data.start + " / 종료일: " + data.end + " / 사용 갯수: " + data.count}</Text>
          </Row>
        })
      }
    </Warpper>
  );
}

export default Develop;