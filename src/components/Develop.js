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

const Row = styled.div`
  padding: 10px;
  margin: 10px;
  border-bottom: 1px solid gray;
`;

const Text = styled.div`
  margin: 3px;
`;

const Develop = props => {
  const { workData = [] } = props;

  return (
    <Warpper>
      {
        workData[0] && workData.map((data, idx) => {
          return <Row key={idx}>
            <Text style={{ color: "gray" }}>순번: {idx}</Text>
            <Text style={{ color: "red" }}>{data.on.id ? ("ID: " + data.on.id + " / 분류: " + data.on.category + " / 텍스트: " + data.on.text + " / 기록시간: " + data.on.slackTime) : "출근 데이터 없음"}</Text>
            <Text style={{ color: "blue" }}>{data.off.id ? ("ID: " + data.off.id + " / 분류: " + data.off.category + " / 텍스트: " + data.off.text + " / 기록시간: " + data.off.slackTime) : "퇴근 데이터 없음."}</Text>
            <Text style={{ color: "green" }}>{"상세시간: " + data.time + " / 반차여부: " + data.half}</Text>
          </Row>
        })
      }
    </Warpper>
  );
}

export default Develop;