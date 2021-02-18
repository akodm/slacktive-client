import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
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
  margin-top: 30px;

  @media (max-width: 552px) {
    width: 100%;
  }

  @media (max-width: 439px) {
    align-items: center;
  }
`;

const ViewText = styled.div`
  display: flex;
  flex-direction: row;
  font-family: NanumBarunGothic;
  font-size: 18px;
  color: #000000;
  word-break: keep-all;
`;

const CategoryCircle = styled.div`
  min-width: 16px;
  max-width: 16px;
  min-height: 16px;
  max-height: 16px;
  border: none;
  border-radius: 50%;
  margin-right: 10px;
  background-color: ${props => props.colors || "#87dffa"};
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
  margin: 20px 10px 10px 10px;
  border-radius: 10px;
  background-color: white;
  font-family: NanumBarunGothic;
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.colors || "black"};
  border: 2px solid ${props => props.colors || "black"};
  cursor: pointer;
  transition-property: transform;
  transition: ease 0.3s 0s;

  &:active {
    transform: scale(1.1);
  }
`;

// 날짜 포맷.
const formatDate = (date) => {
  return moment(date).format("YYYY. M. D (ddd) ");
};

// 시간 포맷.
const formatTime = (time) => {
  return moment(time).format("A h:mm");
};

const Confirm = props => {
  // 초기 밸류.
  const { value: values, edit, deleteSchedule } = props;

  // 헤더 텍스트.
  const headTextEdit = useMemo(() => edit ? "일정 수정하기" : "일정 등록하기", [edit]);

  //  뷰들.
  const views = useMemo(() => [
    {
      key: "title",
      text: "제목",
      divStyle: {
        width: "100%"
      },
      component: <ViewText>
        {values.title}
      </ViewText>
    },
    {
      key: "start and end time",
      text: "시간",
      divStyle: {
        width: "100%"
      },
      component: <ViewText>
        {
          (values.startIsEnd || values.start === values.end) ?
          formatDate(values.start) + formatTime(values.startTime)
          : 
          formatDate(values.start) + formatTime(values.startTime) + " ~ " +
          formatDate(values.end) + formatTime(values.endTime)
        }
      </ViewText>
    },
    {
      key: "category",
      text: "카테고리",
      divStyle: {
        width: "100%"
      },
      component: <ViewText>
        <CategoryCircle colors={values.bgColor} />
        {values.type}
      </ViewText>
    },
    {
      key: "participation",
      text: "참여 인원",
      divStyle: {
        width: "100%",
        overflowX: "auto"
      },
      component: <ParticipationLayout>
        <ParticipationBox>
          <ParticipationIcon alt="icon" src="/img/calendar/cardImg1.png" />
          <ParticipationName>{"Hello World...?"}</ParticipationName>
        </ParticipationBox>
      </ParticipationLayout>
    },
    {
      key: "text",
      text: "메모 사항",
      divStyle: {
        width: "100%",
        whiteSpace: "pre-line"
      },
      component: <ViewText>
        {values.text}
      </ViewText>
    },
  ], [values]);

  // 뷰 컴포넌트.
  const ViewComponents = useCallback((option) => {
    const { divStyle, text, component } = option;
    return <FormDiv style={divStyle}>
      <FormHeadText>{text}</FormHeadText>
      {component}
    </FormDiv>
  }, []);

  // 버튼들.
  const btns = useMemo(() => [
    { key: "update", text: "수정", onClick: () => console.log("update"), colors: "#6c84ff" },
    { key: "delete", text: "삭제", onClick: () => deleteSchedule(values), colors: "#777777" },
  ], [deleteSchedule]);

  return <Container>
    <Head>
      <HeadText>{headTextEdit}</HeadText>
    </Head>
    <HeadLine />
    <Body>
      {views.map((data, idx) => {
        return <ViewComponents {...data} key={idx} />
      })}
      <Layout>
        {btns.map((data, idx) => {
          return <SubmitButton {...data} key={idx}>{data.text}</SubmitButton>
        })}
      </Layout>
    </Body>
  </Container>
};

export default Confirm;