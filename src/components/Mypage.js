import React, { useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import Pagination from '@material-ui/lab/Pagination';
import moment from 'moment';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 66px;
  padding: 30px 30px 13px 30px;
`;

const HeadText = styled.div`
  margin-bottom: 30px;
  font-family: 12LotteMartDream;
  font-size: 18px;
  font-weight: bold;
  color: #000000;
`;

const HeadLine = styled.div`
  width: 100%;
  min-height: 3px;
  background-color: #d8d9d9;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 30px 30px 30px;
`;

const SubLayout = styled.div`
  display: flex;
  flex-direction: row;
`;

const HeadSubText = styled.div`
  width: ${props => props.widthPercent || "50"}%;
  font-family: NanumBarunGothic;
  font-size: 15px;
  font-weight: bold;
  color: #777777;
  text-align: left;
  padding-left: 10px;
`;

const Table = styled.table`
  width: 100%;
  margin-bottom: 30px;
`;
const Tbody = styled.tbody`
  border-bottom: 1px solid black;
`;
const Tr = styled.tr`
  ${props => !props.borderNone && 
    css`
      border-bottom: 1px solid #d8d9d9;
    `
  }
`;
const Td = styled.td`
  width: ${props => props.widthPercent || "50"}%;
  padding: 15px 0px 14.5px 10px;
  font-family: NanumBarunGothic;
  font-size: 20px;
  color: ${props => props.redText ? "#ff4d4d" : "#000000"};
`;

const categorys = [
  { type: "tardy", title: "지각 횟수", month: "월 구분", day: "지각 횟수"  },
  { type: "avg", title: "출근 시간 내역", month: "날짜", day: "출근 시각"  },
  { type: "atten", title: "출근 일수", month: "월 구분", day: "출근 일수"  },
  { type: "over", title: "야근 내역", month: "날짜", day: "초과 근무시간" },
];

const left = 60;
const right = 40;

const Mypage = props => {
  const { 
    category = "tardy", 
    list = [], 
  } = props;

  const title = useMemo(() => {
    return categorys.reduce((first, data) => {
      if(data.type === category) {
        return data;
      }

      return first;
    }, categorys[0]);
  }, [category]);

  // const redText = useCallback(() => {
  //   return false;
  // }, []);

  // const dateParser = useCallback((text, time, show) => {
  //   return moment(text, time).format(show);
  // }, []);

  return (
    <Container>
      <Head>
        <HeadText>{title.title}</HeadText>
        <SubLayout>
          <HeadSubText widthPercent={left}>{title.month}</HeadSubText>
          <HeadSubText widthPercent={right}>{title.day}</HeadSubText>
        </SubLayout>
      </Head>
      <HeadLine />
      <Body>
        <Table>
          <Tbody>
            {
              list[0] ? list.map((data, idx) => {
                return <Tr key={idx}>
                  <Td widthPercent={left}>{moment(data.slackTime, "YYYY-MM-DD HH:mm").format("YYYY. M. DD (ddd)")}</Td>
                  <Td widthPercent={right}>{data.text || data.count}</Td>
                </Tr>
              })
              :
              <Tr>
                <Td colSpan={2}>해당 데이터가 없습니다.</Td>
              </Tr>
            }
          </Tbody>
        </Table>
        <Pagination count={10} color="primary" />
      </Body>
    </Container>
  );
}

export default Mypage;