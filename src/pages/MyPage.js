import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { AnimatedWrapper } from '../components/PageAnim';
import moment from 'moment';
import { useSelector } from 'react-redux';

import Toggle from '../components/Toggle';
import Card from '../components/Card';

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

const HolidayCard = styled.div`
  min-height: 181px;
  border-radius: 30px;
  padding: 30px;
  background-color: #ffffff;

  @media (max-width: 500px) {
    padding: 20px;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 500px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const CardTextBox = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    align-items: center;
  }
`;

const CardCountText = styled.div`
  margin-top: 58px;
  position: relative;

  @media (max-width: 500px) {
    margin-top: 20px;
  }
`;

const CardCountRest = styled.span`
  font-family: NeoDunggeunmo;
  font-size: 30px;
  color: #000000;
`;

const CardCountAdd = styled.span`
  font-family: NeoDunggeunmo;
  font-size: 20px;
  color: #6c84ff;
`;

const CardCountTotal = styled.span`
  font-family: NeoDunggeunmo;
  font-size: 20px;
  color: #000000;
`;

const CardCountUnderLine = styled.div`
  width: 110px;
  min-height: 10px;
  background-color: #e0ff21;
  margin-top: -5px;
`;

const CardInfoText = styled.span`
  margin-top: 31px;
  font-family: NanumBarunGothic;
  font-size: 18px;
  font-weight: 300;
  color: #000000;
  word-break: keep-all;

  @media (max-width: 500px) {
    margin-top: 15px;
    text-align: center;
    font-size: calc(10px + 1vmin);
  }
`;

const CardInfoEx = styled.span`
  font-family: NanumBarunGothic;
  font-size: 18px;
  font-weight: bold;
  color: #000000;
`;

const CardImgBox = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;

  @media (max-width: 500px) {
    margin-top: 20px;
  }
`;

const CardImg = styled.img``;

const ImgSideCount = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 50px;
  position: relative;

  @media (max-width: 500px) {
    margin-left: 0px;
  }
`;

const ImgSideCountAdd = styled.span`
  font-family: NeoDunggeunmo;
  font-size: 30px;
  color: #6c84ff;
  top: 55px;
  left: -30px;
  position: absolute;

  @media (max-width: 500px) {
    left: 10px;
  }
`;

const ImgSideCountRest = styled.span`
  margin-top: 18px;
  font-family: NeoDunggeunmo;
  font-size: 30px;
  color: #000000;
  top: 75px;
  left: -30px;
  position: absolute;

  @media (max-width: 500px) {
    left: 10px;
  }
`;

const CardTitle = styled.span`
  font-family: NanumBarunGothic;
  font-size: 20px;
  color: #000000;
`;

const HistorySection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 33px;
`;

const MyCardTitle = styled.span`
  font-family: 12LotteMartDream;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
`;

const MyCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (max-width: 737px) {
    justify-content: center;
  }
`;

const ImgWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-top: 2vh;
  position: relative;
`;

const AnimalImg = styled.img`
  object-fit: contain;
  width: 20%;
  left: 20px;
  bottom: 10px;
  position: absolute;
`;

const GroundImg = styled.img`
  object-fit: contain;
  width: 70%;
`;

const CastleImg = styled.img`
  object-fit: contain;
  width: 30%;
`;

const HolidayContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  min-height: 100px;
  padding: 40px;
  background-color: white;
`;

const HolidayTextLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const HolidayCircle = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: #e6628b;
`;

const HolidayText = styled.span`
  font-family: 12LotteMartDream;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
`;

const HolidayTagLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 7px;
`;

const HolidayTagImg = styled.img`
  object-fit: contain;
  margin-right: 30px;
`;

const HolidayTagText = styled.span`
  font-family: NanumBarunGothic;
  font-size: 18px;
  color: #000000;
  opacity: ${props => props.use ? "0.6" : "1"};

  @media (max-width: 290px) {
    font-size: 12px;
  }
`;

const AddViewText = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  margin-top: 15px;
  padding: 10px;
  font-family: NanumBarunGothic;
  font-size: 15px;
  color: black;
  border-radius: 8px;
  opacity: 0.7;
  cursor: pointer;
  transition-property: opacity, color, transform;
  transition: ease 0.3s 0s;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const titleText = "내 현황";
const cardText = "내 휴가";
const infoTextFirst = "번 사용했고 ";
const infoTextLast = "남아있어요";
const myCardText = "이번달에 나는 ...";
const holidayText = "휴가 사용 내역";
const plusValue = 5;
const imgCountArr = [
  { count: 20, img: '/img/mypage/full.png' },
  { count: 18, img: '/img/mypage/full-1.png' },
  { count: 14, img: '/img/mypage/full-2.png' },
  { count: 10, img: '/img/mypage/full-3.png' },
  { count: 5, img: '/img/mypage/full-4.png' },
  { count: 1, img: '/img/mypage/full-5.png' },
  { count: 0, img: '/img/mypage/full-over.png' },
  { add: true, img: '/img/mypage/full-ex.png' },
];
const holidayTagArr = [
  { category: "반차", img: "/img/mypage/holiday-3.png" },
  { category: "휴가", img: "/img/mypage/holiday-2.png" },
  { category: "대휴", img: "/img/mypage/holiday-1.png" },
  { category: "병가", img: "/img/mypage/holiday-0.png" },
];
const dummyHoldayTotalCount = 20;

const dummyAvgValue = new Date();
const dummyAttenValue = 20;
const dummyOverValue = 1;

function MyPage(props) {
  const [ toggle, setToggle ] = useState(false);
  const [ itemPerPage, setItemPerPage ] = useState(5);
  const { 
    holidays = {
      extraCount: 0,
      list: [],
      replaceCount: 0,
      toMonthCount: 0,
      totalCount: 0
    }, 
    tardys = {
      currentMonthCount: 0,
      currentYearCount: 0,
      currentYearDataList: [],
      previousMonthCount: 0,
      previousYearCount: 0,
      previousYearDataList: []
    }
  } = useSelector(state => state.mypageDataInitReducer);

  // 휴가 관련 파싱 처리.
  const restHolidayCount = useMemo(() => { return dummyHoldayTotalCount - holidays.totalCount; }, [holidays]);
  
  /**
   * 데이터들은 전년도 기준도 가능해야 함.
   * toggle ? 연도별 : 월별
   */

  // 지각 관련 파싱 처리.
  const tardyDiff = useMemo(() => { 
    const diff = ((toggle ? tardys.previousYearCount : tardys.previousMonthCount) - (toggle ? tardys.currentYearCount : tardys.currentMonthCount)) || 0;

    return `지난${toggle ? "해" : "달"}보다 ${diff > 0 ? diff : diff * -1}회 ${diff > 0 ? "감소" : "증가"}`;
  }, [tardys, toggle]);

  const tardyValue = useMemo(() => {
    const value = (toggle ? tardys.currentYearCount : tardys.currentMonthCount) || 0;
    
    return value;
  }, [tardys, toggle]);

  // 평균 시간 관련 파싱 처리.


  // 출근 관련 파싱 처리.


  // 야근 관련 파싱 처리.


  const itemPerPagePlus = useCallback(() => {
    const newCount = itemPerPage + plusValue;
    setItemPerPage(newCount);
  }, [itemPerPage]);

  const HoldayCountText = useCallback(() => {
    return <CardCountText>
      <CardCountRest>{restHolidayCount || 0}</CardCountRest>
      { holidays.replaceCount && <CardCountAdd>{`(+${holidays.replaceCount})`}</CardCountAdd> }
      <CardCountTotal>/{dummyHoldayTotalCount}</CardCountTotal>
      <CardCountUnderLine />
    </CardCountText>
  }, [restHolidayCount, holidays]);

  const InfoText = useCallback(() => {
    return <CardInfoText>
      {holidays.totalCount}{infoTextFirst}
      <CardInfoEx>{restHolidayCount || 0}번 {holidays.replaceCount && `(+${holidays.replaceCount}) `}</CardInfoEx>
      {infoTextLast}
    </CardInfoText>
  }, [restHolidayCount, holidays]);

  const imageSrcGet = useMemo(() => {
    let src = "/img/mypage/full.png";
    for(let i = 0; i < imgCountArr.length; i++) {
      if(imgCountArr[i].add) {
        src = imgCountArr[i].img;
        break;
      }
      if(restHolidayCount >= imgCountArr[i].count) {
        src = imgCountArr[i].img;
        break;
      }
    }
    return src;
  }, [restHolidayCount]);

  const toggleFunction = useCallback(() => {
    setToggle(!toggle);
  }, [toggle]);

  const cardUrl = useMemo(() => [
    { id: 0, category: "tardy", url: "/img/mypage/card-1.png", title: "지각 횟수", value: tardyValue, info: tardyDiff, src: "/img/mypage/card-run.png", onClick: () => console.log(tardys.currentYearDataList) },
    { id: 1, category: "avg", url: "/img/mypage/card-2.png", title: "평균 출근시간", value: dummyAvgValue, info: "지난달보다 20분 빠름", src: "/img/mypage/card-clock.png", onClick: () => console.log("2") },
    { id: 2, category: "atten", url: "/img/mypage/card-3.png", title: "출근 일수", value: dummyAttenValue, info: `이번달 연차 ${holidays.toMonthCount || 0}개 사용`, src: "/img/mypage/card-work.png", onClick: () => console.log("3") },
    { id: 3, category: "over", url: "/img/mypage/card-4.png", title: "야근 일수", value: dummyOverValue, info: "지난달보다 1회 증가", src: "/img/mypage/card-over.png", onClick: () => console.log("4") },
  ], [
    holidays, 
    tardys, tardyDiff, tardyValue
  ]);

  // const CardDataParser = useCallback(() => {
  //   // ... cardUrl data parse..
  // }, []);

  const HolidayHistoryParser = useCallback(() => {
    return holidays.list ? holidays.list.map((data, idx) => {
      let tag = holidayTagArr.reduce((first, value) => {
        if(value.category === data.category) {
          return value.img;
        }
        return first;
      }, "/img/mypage/holiday-2.png");

      let schedule = "";
      let time = "";
      let use = false;
      let half = /반차/.test(data.category);

      if(moment(data.start).isAfter(new Date())) {
        schedule = "[예정] ";
        use = true;
      }
      
      if(moment(data.start).isSame(data.end)) {
        time = moment(data.start).format("YYYY. M. D (ddd)");
      } else {
        time = `${moment(data.start).format("YYYY. M. D (ddd)")} ~ ${moment(data.end).format("M. D (ddd)")}`;
      }
      
      return itemPerPage > idx && 
      <HolidayTagLayout key={idx}>
        <HolidayTagImg src={tag} alt="img"/>
        <HolidayTagText use={!use}>{schedule}{half && " 반차 "}{time}</HolidayTagText> 
      </HolidayTagLayout>
    })
    :
    null;
  }, [itemPerPage, holidays]);

  return (
    <AnimatedWrapper>
      <Container>
        <TopWrapper>
          <TitleText>{titleText}</TitleText>
          <HolidayCard>
            <CardTitle>{cardText}</CardTitle>
            <CardWrapper>
              <CardTextBox>
                <HoldayCountText />
                <InfoText />
              </CardTextBox>
              <CardImgBox>
                <CardImg src={imageSrcGet} alt="img"/>
                <ImgSideCount>
                  { holidays.replaceCount && <ImgSideCountAdd>{`+${holidays.replaceCount}`}</ImgSideCountAdd> }
                  <ImgSideCountRest>{restHolidayCount || 0}</ImgSideCountRest>
                </ImgSideCount>
              </CardImgBox>
            </CardWrapper>
          </HolidayCard>
          <HistorySection>
            <MyCardTitle>{myCardText}</MyCardTitle>
            <Toggle toggle={toggle} onClick={toggleFunction} />
          </HistorySection>
          <MyCardContainer>
            {
              cardUrl.map(data => {
                return <Card 
                  key={data.id}
                  {...data}
                />
              })
            }
          </MyCardContainer>
        </TopWrapper>
        <ImgWrapper>
          <AnimalImg src="/img/mypage/back-animal.png" alt="img"/>
          <GroundImg src="/img/mypage/back-under.png" alt="img"/>
          <CastleImg src="/img/mypage/back-right.png" alt="img"/>
        </ImgWrapper>
        <HolidayContainer>
          <HolidayTextLayout>
            <HolidayCircle />
            <HolidayText>{holidayText}</HolidayText>
          </HolidayTextLayout>
          <HolidayHistoryParser />
          { itemPerPage < holidays.list?.length && <AddViewText onClick={itemPerPagePlus}>더 보기</AddViewText> }
        </HolidayContainer>
      </Container>
    </AnimatedWrapper>
  );
}

export default MyPage;