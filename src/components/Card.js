import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 292px;
  min-height: 169px;
  margin-top: 24px;
  background-size: cover;
  background-image: url(${props => props.url});
  background-repeat: no-repeat;
  cursor: pointer;
  transition-property: transfrom;
  transition: ease 0.3s 0s;
  position: relative;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 500px) {
    margin-top: calc(1wmin);
    margin-right: 0px;
  }
`;

const TitleText = styled.span`
  font-family: NanumBarunGothic;
  font-size: 18px;
  color: #ffffff;
  margin-top: 24px;
  margin-left: 30px;
`;

const Content = styled.span`
  font-family: NanumBarunGothic;
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  margin-top: 21px;
  margin-left: 30px;
`;

const InfoText = styled.span`
  font-family: NanumBarunGothic;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  margin-top: 27px;
  margin-left: 30px;
`;

const StarImg = styled.img`
  top: 25px;
  right: 25px;
  position: absolute;
  z-index: 0;
`;

const SrcImg = styled.img`
  top: 25px;
  right: 25px;
  position: absolute;
  z-index: 1;
`;

function Card(props) {
  const { category, url = "/img/mypage/card-1.png", none, title, value, info, src, onClick } = props;
  
  const onClickFunction = useCallback(() => {
    onClick && onClick();
  }, [onClick]);

  const valueParser = useMemo(() => {
    let result = value;

    if(none) {
      return result;
    }

    switch(category) {
      case "avg": result = value; break;
      default: result = `${value}일`; break; 
    }
    return result;
  }, [value, category, none]);

  return (
    <Container url={url} onClick={onClickFunction}>
      <TitleText>{title}</TitleText>
      <Content>{value ? valueParser : "없음"}</Content>
      <InfoText>{info}</InfoText>
      { src && <SrcImg src={src} alt="img"/> }
      <StarImg src="/img/mypage/star.png" alt="star"/>
    </Container>
  );
}

export default Card;