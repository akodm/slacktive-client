import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { AnimatedWrapper } from '../components/PageAnim';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { openAlert } from '../actions/alert';
import { requestAxios } from '../util/request';
import Card from '../components/Card';
import moment from 'moment';
import Toggle from '../components/Toggle';
import { LOCALSTORAGE } from '../config';

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

const TitleText = styled.span`
  margin-bottom: 30px;
  font-family: 12LotteMartDream;
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
`;

const MyCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;

  @media (max-width: 650px) {
    justify-content: center;
  }
`;

const BottomBox = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 116px;
  padding: 30px;
  background-color: white;
  border-radius: 14px;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BoxText = styled.span`
  font-family: NanumBarunGothic;
  font-size: 18px;
  color: #000000;
`;

const LogoutText = styled.span`
  width: 100px;
  font-family: NanumBarunGothic;
  font-size: 18px;
  color: #ff4d4d;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition-property: transform, color;
  transition: ease 0.3s 0s;

  &:hover {
    transform: scale(1.1);
    color: blue;
  }
`;

const BoxLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: gray;
  opcity: 0.7;
  margin-bottom: 20px;
`;

const etcTitleText = "기타";
const bottomTitleText = "내 계정 및 앱 정보";
const VERSION = "0.4";

const EtcPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const [ alram, setAlram ] = useState(false);
  const openAlertAction = useCallback((payload) => dispatch(openAlert(payload)), [dispatch]);

  const cardUrl = useMemo(() => [
    {
      id: 0,
      url: "/img/etc/card-1.png",
      title: "투표",
      value: "참여하기",
      info: `마감일: ${moment().format("YY-MM-DD HH:mm")}`,
      onClick: () => openAlertAction("추후 업데이트 예정입니다."),
      none: true
    },
    {
      id: 1,
      url: "/img/etc/card-2.png",
      title: "카페 메뉴판",
      value: "보기",
      info: `마지막 업데이트: ${moment().format("YY-MM-DD")}`,
      onClick: () => openAlertAction("추후 업데이트 예정입니다."),
      none: true
    }
  ], [openAlertAction]);

  // const alramToggle = useCallback(() => setAlram(!alram), [alram]);

  const logoutProcess = useCallback( async () => {
    try {
      const { response, result, status, message } = await requestAxios({ method: "get", url: "/users/logout" });

      if(!result || status === 500) {
        throw new Error(message);
      }

      if(response.data) {
        localStorage.removeItem(LOCALSTORAGE);
        return history.replace("/");
      } else {
        throw new Error("로그아웃 처리 중 문제가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch(err) {
      openAlertAction(err.message || err);
    }
  }, [openAlertAction, history]);

  const logout = useCallback(() => {
    if(!window.confirm("로그아웃 하시겠습니까?")) {
      return;
    }

    logoutProcess();
  }, [logoutProcess]);

  return (
    <AnimatedWrapper>
      <Container>
        <TopWrapper>
          <TitleText>{etcTitleText}</TitleText>
          <MyCardContainer>
            {
              cardUrl.map((data, idx) => {
                return <Card
                  key={idx} 
                  {...data}
                />
              })
            }
          </MyCardContainer>
        </TopWrapper>
        <TopWrapper>
          <TitleText>{bottomTitleText}</TitleText>
          <BottomBox>
            <Layout>
              <BoxText>모바일 푸시알람 설정</BoxText>
              <Toggle onClick={() => openAlertAction("추후 업데이트 예정입니다.")} width="64" on="켜짐" off="꺼짐"></Toggle>
            </Layout>
            <Layout>
              <BoxText>버젼</BoxText>
              <BoxText>ver{VERSION}</BoxText>
            </Layout>
            <BoxLine />
              <LogoutText onClick={logout}>로그아웃 하기</LogoutText>
          </BottomBox>
        </TopWrapper>
      </Container>
    </AnimatedWrapper>
  );
}

export default EtcPage;