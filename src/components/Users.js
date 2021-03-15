import React, { useCallback } from 'react';
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
  padding: 10px 10px 10px 10px;

  @media (max-width: 439px) {
    justify-content: center;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  word-break: keep-all;
  margin: 5px;
  border-bottom: 1px solid rgba(200, 200, 200, 0.6);
`;

const Text = styled.span`
  margin: 5px;
  font-family: 12LotteMartDream;
  font-size: 12px;
  color: black;
`;

const Users = props => {
  const { title, users = [] } = props;

  const UsersComponents = useCallback((props) => {
    const { id, user, slackTime, start, end, count, category } = props;
    return <Box>
      <Text>ID: {id}</Text>
      <Text>이름: {user?.name}</Text>
      <Text>시간: {slackTime ? moment(slackTime, "YYYY-MM-DD HH:mm").format("HH:mm") : moment(start, "YYYY-MM-DD").format("DD일") + "~" + moment(end, "YYYY-MM-DD").format("DD일")}</Text>
      <Text>분류: {category}</Text>
      { count ? <Text>{count}개 사용</Text> : "" }
    </Box>
  }, []);

  return (
    <Container>
      <Head>
        <HeadText>{title || "확인"}</HeadText>
      </Head>
      <HeadLine />
      <Body>
        {
          users[0] && users.map((value, idx) => {
            return <UsersComponents {...value} key={idx} />
          })
        }
      </Body>
    </Container>
  );
}

export default Users;