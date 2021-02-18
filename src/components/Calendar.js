import React, { useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
// import moment from 'moment';

import TextField from '@material-ui/core/TextField';
import {
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete'
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import CancelIcon from '@material-ui/icons/Cancel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  min-height: 66px;
`;

const HeadText = styled.div`
  margin-left: 40px;
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
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0px 40px 40px 40px;

  @media (max-width: 439px) {
    justify-content: center;
  }
`;

const FormHeadText = styled.span`
  font-family: NanumBarunGothic;
  font-size: 15px;
  font-weight: bold;
  color: #777777;
  margin-bottom: 15px;
`;

const FormDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;

  @media (max-width: 552px) {
    width: 100%;
  }

  @media (max-width: 439px) {
    align-items: center;
  }
`;

const CategoryCircle = styled.em`
  min-width: 16px;
  max-width: 16px;
  min-height: 16px;
  max-height: 16px;
  border: none;
  border-radius: 50%;
  margin-right: 10px;
  background-color: ${props => props.colors || "#87dffa"};
`;

const FormAutocomplete = styled(Autocomplete)`
  width: 100%;
  max-width: 200px;

  @media (max-width: 439px) {
    margin-left: -40px;
  }
`;

const TextFieldIcon = styled(ZoomInIcon)`
  max-width: 22px;
  max-height: 22px;
  top: 35px;
  left: 0px;
  position: absolute;

  @media (max-width:439px) {
    opacity: 0;
  }
`;

const Layout = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SubmitButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 198px;
  min-height: 41px;
  max-height: 41px;
  margin-top: 20px;
  border: none;
  border-radius: 10px;
  background-color: #6c84ff;
  font-family: NanumBarunGothic;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  transition-property: transform;
  transition: ease 0.3s 0s;

  &:active {
    transform: scale(1.1);
  }
`;

const ParticipationLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  min-height: 60px;
  overflow-x: auto;
`;

const ParticipationBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  max-height: 41px;
  min-height: 41px;
  border-radius: 4px;
  border: solid 1px #d8d9d9;
  margin-right: 16px;
  padding-left: 10px;
  padding-right: 10px;
  white-space: nowrap;
  position: relative;
`;

const ParticipationClose = styled(CancelIcon)`
  width: 19px;
  height: auto;
  top: -10px;
  right: -10px;
  position: absolute;
  color: #777777;
  cursor: pointer;
`;

const ParticipationIcon = styled.img`
  max-width: 31px;
  min-width: 31px;
  max-height: 31px;
  min-height: 31px;
  border: none;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: contain;
`;

const ParticipationName = styled.span`
  font-family: NanumBarunGothic;
  font-size: 18px;
  color: #000000;
`;

const dummyMembers = [
  { slackId: "aaa", name: "Ko yuri A", tag: "develop" },
  { slackId: "bbb", name: "Ko yuri B", tag: "design" },
  { slackId: "ccc", name: "Ko C", tag: "manager" },
  { slackId: "ddd", name: "Ko D", tag: "develop" },
  { slackId: "eee", name: "yuri E", tag: "develop" },
  { slackId: "fff", name: "yuri F", tag: "design" },
  { slackId: "ggg", name: "yuri Gold lllmal.", tag: "design" },
];

// 카테고리의 내용들.
const categoryCircles = [
  { select: "1", text: "출장/미팅", colors: "#d6ff98" },
  { select: "2", text: "휴가", colors: "#FFEB3B" },
  { select: "3", text: "회의", colors: "#87dffa" },
  { select: "4", text: "생일", colors: "#b0c0ff" },
  { select: "5", text: "기타", colors: "#ff98c3" },
];

// 유저 이미지들.
const userImgs = [
  { tag: "develop", img: "/img/calendar/cardImg1.png" },
  { tag: "design", img: "/img/calendar/cardImg2.png" },
];

const Calendar = props => {
  // 초기 밸류.
  const { 
    value = {
      title: "",
      contents: "",
      start: new Date(),
      startTime: new Date(),
      end: new Date(),
      endTime: new Date(),
      startIsEnd: false,
      category: "1",
      isAllDay: false,
      participation: [],
      participationText: "",
      text: "",
    }, 
    edit = false,
  } = props;
  const [ values, setValues ] = useState(
    { 
      ...value, 
      category: "1",
      participation: [] 
    }
  ); 

  // 헤더 텍스트.
  const headTextEdit = useMemo(() => edit ? "일정 수정하기" : "일정 등록하기", [edit]);

  // 버튼 텍스트.
  const submitTextEdit = useMemo(() => edit ? "수정" : "등록", [edit]);
  
  // 폼의 입력 값 변경.
  const onChangeCalendarModalValue = useCallback((e) => {
    const items = { ...values };
    items[e.target.id] = e.target.value;
    setValues({ ...items });
  }, [values]);

  // 날짜 관련 데이터 변경.
  const onChangeCalendarDate = useCallback((date, key) => {
    const items = { ...values };
    items[key] = date;
    setValues({ ...items });
  }, [values]);

  // 체크박스 값 변경.
  const onChangeCalendarCheck = useCallback((e) => {
    const items = { ...values };
    items[e.target.id] = e.target.checked;

    if(e.target.checked && e.target.id === "startIsEnd") {
      items.end = items.start;
      items.endTime = items.startTime;
    }

    setValues({ ...items });
  }, [values]);

  // 참여인원 값 추가.
  const onChangeCalendarParticipationAdd = useCallback((e, party) => {
    if(party && party.slackId) {
      let duplicate = false;

      for(let i = 0; i < values.participation.length; i++) {
        if(values.participation[i].slackId === party.slackId) {
          duplicate = true;
        }
      }

      if(!duplicate) {
        setValues({ ...values, participation: values.participation.concat(party) });
      }
    }
  }, [values]);

  // 참여인원 값 삭제.
  const onChangeCalendarParticipationDelete = useCallback((party) => {
    const newItems = values.participation.filter(data => { return party.slackId !== data.slackId });

    setValues({ ...values, participation: newItems });
  }, [values]);

  // 카테고리 값 변경.
  const onChangeCalendarCategory = useCallback((e, id) => {
    e.target.id = id;
    onChangeCalendarModalValue(e);
  }, [onChangeCalendarModalValue]);

  // 유저 이미지 추출.
  const participationImg = useCallback((data) => {
    return userImgs.reduce((result, imgs) => {
      if(data.tag === imgs.tag) {
        return imgs.img;
      }

      return result;
    }, "/img/calendar/cardImg1.png");
  }, []);

  // 폼들.
  const forms = useMemo(() => [
    {
      key: "title",
      text: "제목",
      divStyle: {
        width: "100%",
      },
      component: <TextField 
        id="title" 
        fullWidth 
        value={values.title || ""} 
        onChange={onChangeCalendarModalValue} 
        placeholder="어떤 일정인가요?" 
      />,
    },
    {
      key: "start",
      text: "시작일",
      divStyle: {
        maxWidth: "160px",
        width: "100%",
        marginRight: "20px"
      },
      component: <KeyboardDatePicker 
        id="start"
        value={values.start} 
        onChange={(e) => onChangeCalendarDate(e, "start")} 
        format="yyyy. MM. dd"
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }} 
      />,
    },
    {
      key: "startTime",
      text: "시작 시간",
      divStyle: {
        maxWidth: "160px",
        width: "100%",
        marginRight: "20px"
      },
      component: <KeyboardTimePicker 
        id="startTime"
        value={values.startTime} 
        onChange={(e) => onChangeCalendarDate(e, "startTime")} 
        format="a h:mm"
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }} 
      />,
    },
    {
      key: "startIsEnd",
      divStyle: {},
      component: <FormControlLabel 
        control={
          <Checkbox 
            id="startIsEnd"
            checked={values.startIsEnd || false} 
            color="primary" 
            onChange={onChangeCalendarCheck} 
            style={{ maxWidth: "24px", maxHeight: "24px", margin: "0px", padding: "0px" }} 
          />
        }
        label="종료일과 같음"
        style={{ margin: "0px", padding: "0px" }}
      />,
    },
    {
      key: "end",
      text: "종료일",
      divStyle: {
        maxWidth: "160px",
        width: "100%",
        marginRight: "20px"
      },
      component: <KeyboardDatePicker 
        id="end"
        disabled={values.startIsEnd}
        value={values.end} 
        onChange={(e) => onChangeCalendarDate(e, "end")} 
        format="yyyy. MM. dd"
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }} 
      />,
    },
    {
      key: "endTime",
      text: "종료 시간",
      divStyle: {
        maxWidth: "160px",
        width: "100%",
        marginRight: "20px"
      },
      component: <KeyboardTimePicker 
        id="endTime"
        disabled={values.startIsEnd}
        value={values.endTime} 
        onChange={(e) => onChangeCalendarDate(e, "endTime")} 
        format="a h:mm"
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }} 
      />,
    },
    {
      key: "category",
      text: "카테고리",
      divStyle: {
        width: "100%"
      },
      component: <FormControl variant="outlined">
        <Select
          value={values.category}
          onChange={(e) => onChangeCalendarCategory(e, "category")}
          style={{
            width: "100%",
            maxWidth: "174px",
            maxHeight: "41px"
          }}
        >
          {categoryCircles.map((data, idx) => {
            return <MenuItem key={idx} value={data.select}>
              <CategoryCircle colors={data.colors}></CategoryCircle>
              {data.text}
            </MenuItem>
          })}
        </Select>
      </FormControl>,
    },
    {
      key: "participationText",
      text: "참여인원",
      divStyle: {
        width: "100%",
        position: "relative",
      },
      component: <>
        <TextFieldIcon />
        <FormAutocomplete 
          options={dummyMembers}
          clearOnBlur
          clearOnEscape
          selectOnFocus
          disabled={values.category === "2"}
          onChange={onChangeCalendarParticipationAdd}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField 
            {...params} 
            placeholder="누가 참여하나요?" 
            id="participationText"
            value={values.participationText}
            onChange={onChangeCalendarModalValue}
            style={{ paddingLeft: "22px", marginBottom: "17px" }}
          />}
        />
        <ParticipationLayout>
          {
            values.participation && values.participation.map((data ,idx) => {
              const src = participationImg(data);
              return <ParticipationBox key={idx}>
                <ParticipationClose onClick={() => onChangeCalendarParticipationDelete(data)} />
                <ParticipationIcon src={src} alt="icon" />
                <ParticipationName>{data.name || "???"}</ParticipationName>
              </ParticipationBox>
            })
          }
        </ParticipationLayout>
      </>,
    },
    {
      key: "text",
      text: "메모 사항",
      divStyle: {
        width: "100%",
      },
      component: <TextField 
        id="text" 
        fullWidth 
        value={values.text || ""} 
        disabled={values.category === "2"}
        onChange={onChangeCalendarModalValue} 
        placeholder="자세한 내용은 무엇인가요?"
        multiline
        rows={5}
        variant="outlined"
        style={{ maxHeight: "125px" }}
      />,
    },
  ], [
    values, 
    participationImg,
    onChangeCalendarModalValue, 
    onChangeCalendarDate, 
    onChangeCalendarCheck, 
    onChangeCalendarCategory, 
    onChangeCalendarParticipationAdd,
    onChangeCalendarParticipationDelete,
  ]);

  // 폼 뷰.
  const FormsComponent = useCallback((option) => {
    const { divStyle, text, component } = option;
    return <FormDiv style={divStyle}>
      <FormHeadText>{text}</FormHeadText>
      {component}
    </FormDiv>
  }, []);

  return (
    <Container>
      <Head>
        <HeadText>{headTextEdit}</HeadText>
      </Head>
      <HeadLine />
      <Body>
        {forms.map((data, idx) => {
          return <FormsComponent key={idx} {...data} />
        })}
        <Layout>
          <SubmitButton onClick={() => console.log("submit")}>{submitTextEdit}</SubmitButton>
        </Layout>
      </Body>
    </Container>
  );
}

export default Calendar;