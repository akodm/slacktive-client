import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { AnimatedWrapper } from '../components/PageAnim';
import { requestAxios } from '../util/request';
import { useDispatch } from 'react-redux';
import { CSVLink } from 'react-csv';
import { loadmaskOff, loadmaskOn  } from '../actions/loadmask';
import { openModal } from '../actions/modal';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DevelopModal from '../components/Develop';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  ailgn-items: center;
  width: 100%;
`;

const Warpper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 30px;
`;

const Table = styled.table`
  width: 100%;
  min-height: 100px;
  margin: 20px;
  border-radius: 12px;
  background-color: white;
  overflow: hidden;
`;

const Thead = styled.thead`
  border-bottom: 1px solid gray;
`;

const Tbody = styled.tbody``;

const Td = styled.td`
  font-family: 12LotteMartDream;
  font-size: calc(5px + 1vmin);
  font-weight: 500;
  color: black;
  padding: 10px;
  font-family: 12LotteMartDream;
  text-align: ${props => props.textAlign || "left"};
  border-bottom: 1px solid gray;
`;

const Tr = styled.tr`
  cursor: pointer;
  transition-property: color, background-color;
  transition: ease 0.3s 0s;

  &:hover {
    background-color: rgba(200, 200, 200, 0.6);
  }

  &:active {
    background-color: rgba(200, 200, 200, 0.6);
  }
`;

const InputLayout = styled.div`
  display: flex;
  flex-direction: row;
`;

const header = [
  { text: "이름" },
  { text: "이번 달 근로일 수" },
  { text: "사용 휴가 갯수" },
  { text: "실제 근로일 수" },
  { text: "총 근로시간" },
  { text: "슬랙 기준 근로시간" },
  { text: "연장근로" },
];

const defaultYear = parseInt(moment(new Date()).format("YYYY"));
const defaultMonth = parseInt(moment(new Date()).format("MM"));
const modalOptions = { width: 570, height: 944, backdrop: true };

const Develop = () => {
  const dispatch = useDispatch();
  const [ year, setYear ] = useState(defaultYear);
  const [ month, setMonth ] = useState(defaultMonth);
  const [ data, setData ] = useState([]);
  const loadmaskOnAction = useCallback(() => dispatch(loadmaskOn()), [dispatch]);
  const loadmaskOffAction = useCallback(() => dispatch(loadmaskOff()), [dispatch]);
  const openModalAction = useCallback((payload) => dispatch(openModal(payload)), [dispatch]);

  const tableDataTotal = useCallback( async (year = defaultYear, month = defaultMonth) => {
    try {
      loadmaskOnAction();

      const { response, result, message } = await requestAxios({
        method: "get",
        url: `/holiday/one/develop/work?year=${moment(year, "YYYY").format("YYYY")}&month=${moment(month, "MM").format("MM")}`
      });

      if(!result) {
        throw new Error(message);
      }

      loadmaskOffAction();
      setData(response.data);
    } catch(err) {
      loadmaskOffAction();
      console.log(err);
    }
  }, [loadmaskOnAction, loadmaskOffAction]);

  useEffect(() => {
    tableDataTotal();
  }, [tableDataTotal]);

  const submitEvent = useCallback(() => {
    tableDataTotal(year, month);
  }, [year, month, tableDataTotal]);

  const modalOpenEvent = useCallback((workData, holidays) => {
    openModalAction({
      contents: <DevelopModal 
        workData={workData}
        holidays={holidays}
      />,
      ...modalOptions
    });
  }, [openModalAction]);

  const TableBodyComponents = useCallback((props) => {
    const { data, realTotalOverTime, result, workData, workDataLength } = props;
    const overValue = realTotalOverTime - data.totalWorkTime;
    return (result) ? <Tr onClick={() => modalOpenEvent(workData, data.holidays)}>
      <Td>{data.name}</Td>
      <Td>{data.businessDayCount}</Td>
      <Td>{data.count}</Td>
      <Td>{data.totalWorkDayCount} / {workDataLength}</Td>
      <Td>{data.totalWorkTime}</Td>
      <Td>{realTotalOverTime}</Td>
      <Td>{overValue >= 0 ? overValue.toFixed(2) : 0}</Td>
    </Tr>
    :
    <Tr>
      <Td colSpan="7">데이터를 가져오는데 실패하였습니다.</Td>
    </Tr>
  }, [modalOpenEvent]);

  const onChangeDate = useCallback((e) => {
    if(e.target.id === "year") {
      if(e.target.value.length > 4) {
        return;
      }
      setYear(e.target.value);
    } else {
      if(e.target.value.length > 2) {
        return;
      }
      setMonth(e.target.value);
    }
  }, []);

  const excelDataExport = useMemo(() => {
    return data.map(row => {
      const overValue = row.realTotalOverTime - row.data.totalWorkTime;
      return {
        "이름": row.data.name,
        "근로일 수": row.data.businessDayCount,
        "휴가 갯수": row.data.count,
        "총 근로일 수": `${row.data.totalWorkDayCount}`,
        "실제 근무시간": row.data.totalWorkTime,
        "슬랙 근무시간": row.realTotalOverTime,
        "연장근로": overValue >= 0 ? overValue.toFixed(2) : 0
      };
    });
  }, [data]);

  return (
    <AnimatedWrapper>
      <Container>
        <Warpper>
          <InputLayout>
            {
              data[0] &&
              <Button style={{ margin: "10px", minWidth: "100px" }} variant="outlined" color="primary">
                <CSVLink
                  data={excelDataExport}
                  filename={`cedar_${year}년_${month}월_근태내역_통계.csv`}
                  target="_blank"
                >
                  Excel Export
                </CSVLink>
              </Button>
            }
            <Button style={{ margin: "10px", minWidth: "100px" }} variant="contained" color="primary" onClick={submitEvent}>호출</Button>
            <TextField style={{ margin: "10px" }} type="number" id="year" onChange={onChangeDate} value={year} label="년" />
            <TextField style={{ margin: "10px" }} type="number" id="month" onChange={onChangeDate} value={month} label="월" />
          </InputLayout>
          <Table>
            <Thead>
              <Tr>
                {header.map((data, idx) => <Td key={idx}>{data.text}</Td>)}
              </Tr>
            </Thead>
            <Tbody>
              {
                data[0] && data.map((values, idx) => {
                  return <TableBodyComponents key={idx} {...values} />
                })
              }
            </Tbody>
          </Table>
        </Warpper>
      </Container>
    </AnimatedWrapper>
  );
}

export default Develop;