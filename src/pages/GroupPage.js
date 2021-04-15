import React, { useCallback, useState, useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import Pagination from '@material-ui/lab/Pagination';
import { useSelector } from 'react-redux';
import { AnimatedWrapper } from '../components/PageAnim';
import Toggle from '../components/Toggle';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;

  @media (max-width: 500px) {
    padding: 16px;
  }
`;

const TitleText = styled.span`
  margin-bottom: 30px;
  font-family: 12LotteMartDream;
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
`;

const TablePaper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 810px;
  background-color: white;
  border-radius: 20px;
  background-color: #ffffff;
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

const itemPer = 12;
const firstPage = 1;

const GroupPage = () => {
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

  const dispatchForCount = useCallback((array, slackId, key) => {
    let count = 0;

    if(Array.isArray(array)) {
      for(let i = 0; i < array.length; i++) {
        if(array[i].slackId === slackId) {
          count += array[i][key] ? parseInt(array[i][key]) : 0;
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

  const MobileViewComponent = useCallback(() => {
    if(windowSize < 500) {
      // 모바일 뷰 전환.
      /**
       * return <Container>
       *  ...
       *  ...
       *  ...
       * </Container>
       */
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
    </Container>
  }, [colorSet, toggleSet, onPagenation, currentPage, pageLength, toggle, windowSize, sortedDataArray]);

  return (
    <AnimatedWrapper>
      <MobileViewComponent />
    </AnimatedWrapper>
  );
}

export default GroupPage;