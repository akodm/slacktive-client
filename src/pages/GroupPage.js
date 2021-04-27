import React, { useCallback, useState, useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import Pagination from '@material-ui/lab/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatedWrapper } from '../components/PageAnim';
import Toggle from '../components/Toggle';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import { openModal } from '../actions/modal';
import DetailModal from '../components/Group';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;

  @media (max-width: 500px) {
    padding: 16px;
  }
`;

const TopWrapperMedia = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 34px;
  padding: 16px;
`;

const TitleText = styled.span`
  font-family: 12LotteMartDream;
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
`;

const TablePaper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  border-radius: 20px;
  background-color: #ffffff;
  margin-bottom: 87px;
`;

const TableHead = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 30px 0;
  padding: 0 22px 0 40px;
`;

const TableTitle = styled.span`
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

const TableTop = styled.table`
  text-align: left;
  font-family: NanumBarunGothic;
  font-size: 15px;
  font-weight: bold;
  color: #777777;
  margin: 0px 30px 13px 30px;
`;

const TableMedia = styled.table`
  width: 100%;
  text-align: left;
  font-family: NanumBarunGothic;
  margin-top: 20px;
`;

const TableHeadMedia = styled.thead`
  font-family: NanumBarunGothic;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
`;

const TrMedia = styled.tr`
  ${props => props.anim &&
    css`
      transition-property: transform;
      transition: ease 0.3s 0s;
      cursor: pointer;

      &:hover {
        transform: scale(1.01);
      }
    `
  }
`;

const TdMedia = styled.td`
  ${props => props.widthPercent &&
    css`
      width: ${props.widthPercent}%;
    `
  }
`;

const TopTd = styled.td`
  ${props => props.widthPercent &&
    css`
      width: ${props.widthPercent}%;
    `
  }

  ${props => props.align &&
    css`
      text-align: ${props.align};
    `
  }
`;

const TableBot = styled.table`
  margin: 0px 30px 37px 30px;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  ${props => !props.borderNone && 
    css`
      border-bottom: 1px solid #d8d9d9;
    `
  }

  ${props => props.anim &&
    css`
      transition-property: transform, background-color;
      transition: ease 0.3s 0s;
      cursor: pointer;

      &:hover {
        transform: scale(1.01);
        background-color: rgba(240, 240, 240, 1);
      }
    `
  }
`;

const Td = styled.td`
  ${props => props.widthPercent &&
    css`
      width: ${props.widthPercent}%;
    `
  }
  padding: 15px 0px 14.5px 0px;
  font-family: NanumBarunGothic;
  font-size: 18px;
  color: #000000;
  ${props => props.textColor &&
    (props.textColor === "#000000" ?
    css`
      color: ${props.textColor};
    `
    :
    css`
      font-weight: bold;
      color: ${props.textColor};
    `)
  }
`;

const ButtonLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 37px;
`;

const ImageLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1 0 auto;
  position: relative;
`;

const GroundImg = styled.img`
  height: 40px;
  width: 100%;
`;

const LeftImg = styled.img`
  width: 163.8px;
  height: 52px;
  object-fit: contain;
  left: 0;
  bottom: 25px;
  position: absolute;
`;

const RightImg = styled.img`
  width: 84px;
  height: 52px;
  object-fit: contain;
  right: 0;
  bottom: 25px;
  position: absolute;
`;

const topTds = [
  { key: "0", name: "순번", widthPercent: "10" },
  { key: "1", name: "이름", widthPercent: "30" },
  { key: "2", name: "사용 휴가", widthPercent: "15" },
  { key: "3", name: "지각", widthPercent: "10" },
  { key: "4", name: "야근", widthPercent: "10" },
  { key: "5", name: "총 휴가", widthPercent: "15" },
  { key: "6", name: "출근", widthPercent: "10" },
];

const TableDiv = styled.div`
  margin-bottom: 10px;
`;

const TableTrDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 54px;
  margin: 10px;
  border-radius: 10px;
  padding: 0px 12px 0px 12px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  background-color: #ffffff;

  ${props => props.anim &&
    css`
      transition-property: transform, background-color;
      transition: ease 0.3s 0s;
      cursor: pointer;

      &:hover {
        transform: scale(1.01);
        background-color: rgba(240, 240, 240, 1);
      }
    `
  }
`;

const TableTdDiv = styled.div`
  ${props => props.widthPercent &&
    css`
      width: ${props.widthPercent}%;
    `
  }
  font-family: NanumBarunGothic;
  font-size: 18px;
  color: #000000;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  ${props => props.textColor &&
    (props.textColor === "#000000" ?
    css`
      color: ${props.textColor};
    `
    :
    css`
      font-weight: bold;
      color: ${props.textColor};
    `)
  }
`;

const NameArrow = styled(ArrowForwardIosOutlinedIcon)`
  max-width: 15px;
  max-height: 12px;
  margin-left: 5px;
`;

const topTdsMedia = [
  { key: "0", name: "이름", widthPercent: "35" },
  { key: "1", name: "사용휴가", widthPercent: "35" },
  { key: "2", name: "지각", widthPercent: "15" },
  { key: "3", name: "야근", widthPercent: "15" },
];

const itemPer = 12;
const firstPage = 1;
const calendarModalOptions = { width: 570, height: 936, backdrop: true };

const GroupPage = () => {
  const dispatch = useDispatch();
  const [ windowSize, setWindowSize ] = useState(window.innerWidth);
  const [ currentPage, setCurrentPage ] = useState(firstPage);
  const [ toggle, setToggle ] = useState(false);
  const { 
    monthUseHolidays = [],
    yearUseHolidays = [],
    monthTardys = [],
    yearTardys = [],
    monthOvers = [],
    yearOvers = [],
    users = [],
    monthAttens = [],
    yearAttens = [] 
  } = useSelector(state => state.groupDataInitReducer);
  const openModalAction = useCallback((payload) => dispatch(openModal(payload)), [dispatch]);

  const dispatchForCount = useCallback((array, slackId, key) => {
    let count = 0;

    if(Array.isArray(array)) {
      for(let i = 0; i < array.length; i++) {
        if(array[i].slackId === slackId) {
          count += array[i][key] ? parseFloat(array[i][key]) : 0;
          break;
        }
      }

      return count;
    }

    return array;
  }, []);

  const sortedDataArray = useMemo(() => {
    return users[0] ? users.map(data => {
      const id = data.id;
      const name = data.name;
      const slackId = data.slackId;

      const monthUseHolidayCount = dispatchForCount(monthUseHolidays, slackId, "use") || 0;
      const yearUseHolidayCount = dispatchForCount(yearUseHolidays, slackId, "use") || 0;
      const monthTardyCount = dispatchForCount(monthTardys, slackId, "tardy") || 0;
      const yearTardyCount = dispatchForCount(yearTardys, slackId, "tardy") || 0;
      const monthOverCount = dispatchForCount(monthOvers, slackId, "over") || 0;
      const yearOverCount = dispatchForCount(yearOvers, slackId, "over") || 0;
      const totalHolidayCount = dispatchForCount(users, slackId, "holiday") || 0;
      const monthAttenCount = dispatchForCount(monthAttens, slackId, "count") || 0;
      const yearAttenCount = dispatchForCount(yearAttens, slackId, "count") || 0;

      return {
        id,
        name,
        slackId,
        monthUseHolidayCount,
        yearUseHolidayCount,
        monthTardyCount,
        yearTardyCount,
        monthOverCount,
        yearOverCount,
        totalHolidayCount,
        monthAttenCount,
        yearAttenCount
      };
    })
    :
    [];
  }, [
    monthUseHolidays, yearUseHolidays,
    monthTardys, yearTardys,
    monthOvers, yearOvers,
    monthAttens, yearAttens,
    users,
    dispatchForCount
  ]);

  const pageLength = useMemo(() => Math.ceil(sortedDataArray.length / itemPer), [sortedDataArray]);

  const toggleSet = useCallback(() => setToggle(!toggle), [toggle]);

  const browserHandler = useCallback((e) => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', browserHandler);

    return () => window.removeEventListener('resize', browserHandler);
  }, [browserHandler]);

  const onPagenation = useCallback((e, v) => {
    setCurrentPage(v);
  }, []);

  const colorSet = useCallback((data, color) => {
    if(parseFloat(data) <= 0.0 || data === "0") {
      return "#000000";
    }

    return color;
  }, []);

  const onClickDetail = useCallback(data => {
    const attenCount = toggle ? data.yearAttenCount : data.monthAttenCount;

    openModalAction({
      contents: <DetailModal 
        name={data.name}
        totalHolidayCount={data.totalHolidayCount}
        attenCount={attenCount}
      />,
      close: false,
      ...calendarModalOptions
    });
  }, [openModalAction, toggle]);

  const MobileViewComponent = useCallback(() => {
    if(windowSize < 500) {
      // 모바일 뷰 전환.
      return <Container>
        <TopWrapperMedia>
          <TitleText>직원 현황</TitleText>
          <Toggle onClick={toggleSet} toggle={toggle} on="연 통계" off="월 통계"  />
        </TopWrapperMedia>
        <TopWrapper>
          <TableMedia>
            <TableHeadMedia>
              <TrMedia>
                {
                  topTdsMedia.map(data => {
                    return <TdMedia key={data.key} widthPercent={data.widthPercent}>{data.name}</TdMedia>
                  })
                }
              </TrMedia>
            </TableHeadMedia>
          </TableMedia>
          <TableDiv>
            {
              sortedDataArray.map((row, idx) => {
                if(idx < itemPer * (currentPage - 1)) {
                  return null;
                }

                if(idx >= itemPer * currentPage) {
                  return null;
                }

                if(toggle) {
                  return <TableTrDiv key={idx} anim onClick={() => onClickDetail(row)}>
                    <TableTdDiv widthPercent="45">{row.name}<NameArrow /></TableTdDiv>
                    <TableTdDiv widthPercent="25" textColor={colorSet(row.yearUseHolidayCount, "#4ea9ff")}>{row.yearUseHolidayCount}</TableTdDiv>
                    <TableTdDiv widthPercent="15" textColor={colorSet(row.yearTardyCount, "#ff4d4d")}>{row.yearTardyCount}</TableTdDiv>
                    <TableTdDiv widthPercent="15" textColor={colorSet(row.yearOverCount, "#f2994a")}>{row.yearOverCount}</TableTdDiv>
                  </TableTrDiv>
                }

                return <TableTrDiv key={idx} anim onClick={() => onClickDetail(row)}>
                  <TableTdDiv widthPercent="45">{row.name}<NameArrow /></TableTdDiv>
                  <TableTdDiv widthPercent="25" textColor={colorSet(row.monthUseHolidayCount, "#4ea9ff")}>{row.monthUseHolidayCount}</TableTdDiv>
                  <TableTdDiv widthPercent="15" textColor={colorSet(row.monthTardyCount, "#ff4d4d")}>{row.monthTardyCount}</TableTdDiv>
                  <TableTdDiv widthPercent="15" textColor={colorSet(row.monthOverCount, "#f2994a")}>{row.monthOverCount}</TableTdDiv>
                </TableTrDiv>
              })
            }
          </TableDiv>
          <ButtonLayout>
            <Pagination defaultPage={firstPage} page={currentPage} size="large" onChange={onPagenation} count={pageLength} color="primary" />
          </ButtonLayout>
        </TopWrapper>
      </Container>
    }

    return <Container>
      <TopWrapper>
        <TitleText>직원 현황</TitleText>
      </TopWrapper>
      <TopWrapper>
        <TablePaper>
          <TableHead>
            <TableTitle>근태 현황</TableTitle>
            <Toggle onClick={toggleSet} toggle={toggle} on="연 통계" off="월 통계"  />
          </TableHead>
          <TableTop>
            <Tbody>
              <Tr borderNone>
                {
                  topTds.map(row => {
                    return <TopTd align={row.align} widthPercent={row.widthPercent} key={row.key}>{row.name}</TopTd>
                  })
                }
              </Tr>
            </Tbody>
          </TableTop>
          <HeadLine />
          <TableBot>
            <Tbody>
              {
                sortedDataArray.map((row, idx) => {
                  if(idx < itemPer * (currentPage - 1)) {
                    return null;
                  }
  
                  if(idx >= itemPer * currentPage) {
                    return null;
                  }

                  if(toggle) {
                    return <Tr key={idx} anim>
                      <Td widthPercent="10">{row.id}</Td>
                      <Td widthPercent="30">{row.name}</Td>
                      <Td widthPercent="15" textColor={colorSet(row.yearUseHolidayCount, "#4ea9ff")}>{row.yearUseHolidayCount}</Td>
                      <Td widthPercent="10" textColor={colorSet(row.yearTardyCount, "#ff4d4d")}>{row.yearTardyCount}</Td>
                      <Td widthPercent="10" textColor={colorSet(row.yearOverCount, "#f2994a")}>{row.yearOverCount}</Td>
                      <Td widthPercent="15">{row.totalHolidayCount}</Td>
                      <Td widthPercent="10">{row.yearAttenCount}</Td>
                    </Tr>
                  }

                  return <Tr key={idx} anim>
                    <Td widthPercent="10">{row.id}</Td>
                    <Td widthPercent="30">{row.name}</Td>
                    <Td widthPercent="15" textColor={colorSet(row.monthUseHolidayCount, "#4ea9ff")}>{row.monthUseHolidayCount}</Td>
                    <Td widthPercent="10" textColor={colorSet(row.monthTardyCount, "#ff4d4d")}>{row.monthTardyCount}</Td>
                    <Td widthPercent="10" textColor={colorSet(row.monthOverCount, "#f2994a")}>{row.monthOverCount}</Td>
                    <Td widthPercent="15">{row.totalHolidayCount}</Td>
                    <Td widthPercent="10">{row.monthAttenCount}</Td>
                  </Tr>
                })
              }
            </Tbody>
          </TableBot>
          <ButtonLayout>
            <Pagination defaultPage={firstPage} page={currentPage} size="large" onChange={onPagenation} count={pageLength} color="primary" />
          </ButtonLayout>
        </TablePaper>
      </TopWrapper>
      <ImageLayout>
        <GroundImg src="/img/group/ground.png" alt="img" />
        <LeftImg src="/img/group/left.png" alt="img" />
        <RightImg src="/img/group/right.png" alt="img" />
      </ImageLayout>
    </Container>
  }, [colorSet, onClickDetail, toggleSet, onPagenation, currentPage, pageLength, toggle, windowSize, sortedDataArray]);

  return (
    <AnimatedWrapper>
      <MobileViewComponent />
    </AnimatedWrapper>
  );
}

export default GroupPage;