import React, { useMemo, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import Pagination from '@material-ui/lab/Pagination';
import moment from 'moment';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { useDispatch } from 'react-redux';
import { closeModal } from '../actions/modal';
import { openAlert } from '../actions/alert';

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
  min-height: 86px;
  padding: 30px 30px 13px 30px;
  position: relative;
`;

const HeadText = styled.div`
  margin-bottom: 30px;
  font-family: 12LotteMartDream;
  font-size: 18px;
  font-weight: bold;
  color: #000000;

  @media (max-width: 570px) {
    margin-left: 30px;
  }
`;

const MobileCloseBtn = styled(NavigateBeforeIcon)`
  display: none;
  visibility: hidden;

  @media (max-width: 570px) {
    display: flex;
    visibility: visible;
    transform: scale(1.3);
    top: 25px;
    cursor: pointer;
    position: absolute;

    &:hover {
      transform: scale(1.5);
    }
  }
`;

const HeadLine = styled.div`
  width: 100%;
  min-height: 3px;
  background-color: #d8d9d9;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 30px 30px 30px;
`;

const SubLayout = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 570px) {
    margin-top: 20px;
  }
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
  
  ${props => props.anim &&
    css`
      transition-property: transform, opacity;
      transition: ease 0.3s 0s;
      cursor: pointer;

      &:hover {
        transform: scale(1.1);
        opacity: 0.5;
      }
    `
  }
`;

const TopScrollBtn = styled.img`
  display: none;
  visibility: none;
  bottom: 15px;
  right: 15px;
  cursor: pointer;
  position: absolute;
  transition-property: transform;
  transition: ease 0.3s 0s;

  @media (max-width: 570px) {
    display: block;
    visibility: visible;
  }

  &:hover {
    transform: scale(1.2);
  }

  &:active {
    transform: scale(1.3);
  }
`;

// scrollBtn
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
  const dispatch = useDispatch();
  const { 
    category = "tardy", 
    list = [], 
  } = props;
  const pageLength = useMemo(() => Math.ceil(list.length / itemPer), [list]);
  const [ currentPage, setCurrentPage ] = useState(firstPage);
  const closeModalAction = useCallback(() => dispatch(closeModal()), [dispatch]);
  const openAlertAction = useCallback((payload) => dispatch(openAlert(payload)), [dispatch]);

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

  const topScrollEvent = useCallback(() => {
    document.getElementById("head").scrollIntoView();
  }, []);

  return (
    <Container>
      <Head id="head">
        <MobileCloseBtn onClick={closeModalAction} />
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
                  <Td widthPercent={right} anim onClick={() => openAlertAction("상세보기 혹은 수정 요청 기능이 추가될 예정입니다.")} redText={redText(data.category || "", data.count || 0)}>{dataText(data.over || data.slackTime, data.count || 0)}</Td>
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
        <TopScrollBtn onClick={topScrollEvent} src="/img/mypage/scrollBtn.png" alt="Scroll Btn" />
      </Body>
    </Container>
  );
}

export default Mypage;