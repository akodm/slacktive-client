import React, { useMemo, useCallback, useState } from 'react';
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
  { type: "tardy", title: "지각 횟수", month: "월 구분", day: "지각 횟수", date: "YYYY-MM", format: "YYYY년 M월",  },
  { type: "avg", title: "출근 시간 내역", month: "날짜", day: "출근 시각", date: "YYYY-MM-DD HH:mm", format: "YYYY. M. D (ddd)",  },
  { type: "atten", title: "출근 일수", month: "월 구분", day: "출근 일수", date: "YYYY-MM", format: "YYYY년 M월",  },
  { type: "over", title: "야근 내역", month: "날짜", day: "초과 근무시간", date: "YYYY-MM-DD HH:mm", format: "YYYY. M. D (ddd)", },
];

const left = 60;
const right = 40;
const itemPer = 13;
const firstPage = 1;

const Mypage = props => {
  const { 
    category = "tardy", 
    list = [], 
  } = props;
  const pageLength = useMemo(() => Math.ceil(list.length / itemPer), [list]);
  const [ currentPage, setCurrentPage ] = useState(firstPage);

  const title = useMemo(() => {
    return categorys.reduce((first, data) => {
      if(data.type === category) {
        return data;
      }

      return first;
    }, categorys[0]);
  }, [category]);

  const redText = useCallback((category, count) => {
    if(count && props?.category === "tardy") {
      return true;
    }

    return category === "지각" ? true : false;
  }, [props?.category]);

  const overValueParser = useCallback((time) => {
    if(time) {
      let [ hour, minute ] = time.toString().split(".");
      
      if(minute) {
        const value = (60 * parseFloat(minute).toFixed(0) / 100).toFixed(0);

        minute = value;
      }

      return `${hour > 0 ? `${hour}시간 ` : ""}${minute > 0 ? `${minute}분` : ""}`;
    }
  }, []);

  const dataText = useCallback((text, count) => {
    if(count) {
      return `${count}번`;
    }

    if(props?.category === "over") {
      return overValueParser(text);
    }

    return moment(text, "YYYY-MM-DD HH:mm").format("HH시 mm분");
  }, [props?.category, overValueParser]);

  const onPagenation = useCallback((e, v) => {
    setCurrentPage(v);
  }, []);

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
                if(idx < itemPer * (currentPage - 1)) {
                  return null;
                }

                if(idx >= itemPer * currentPage) {
                  return null;
                }

                return <Tr key={idx}>
                  <Td widthPercent={left}>{moment(data.slackTime, title.date).format(title.format)}</Td>
                  <Td widthPercent={right} redText={redText(data.category || "", data.count || 0)}>{dataText(data.over || data.slackTime, data.count || 0)}</Td>
                </Tr>
              })
              :
              <Tr>
                <Td colSpan={2}>해당 데이터가 없습니다.</Td>
              </Tr>
            }
          </Tbody>
        </Table>
        <Pagination defaultPage={firstPage} size="large" onChange={onPagenation} count={pageLength} color="primary" />
      </Body>
    </Container>
  );
}

export default Mypage;