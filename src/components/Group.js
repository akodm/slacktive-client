import React, { useCallback } from 'react';
import styled from 'styled-components';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { useDispatch } from 'react-redux';
import { closeModal } from '../actions/modal';

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
  padding: 30px 30px 0px 30px;
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
  margin-top: -40px;
  background-color: #d8d9d9;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 0px 30px 0px;
`;

const ValueLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 127px;
  border-bottom: 1px solid #d8d9d9;
`;

const ValueTitle = styled.span`
  font-family: NanumBarunGothic;
  font-size: 18px;
  font-weight: bold;
  color: #777777;
  margin-left: 30px;
`;

const ValueText = styled.span`
  font-family: NanumBarunGothic;
  font-size: 18px;
  color: #000000;
  margin-left: 30px;
`;

const Group = (props) => {
  const dispatch = useDispatch();
  const { name, totalHolidayCount, attenCount } = props;
  const closeModalAction = useCallback(() => dispatch(closeModal()), [dispatch]);

  return (
    <Container>
      <Head>
        <MobileCloseBtn onClick={closeModalAction} />
        <HeadText>{name}</HeadText>
      </Head>
      <HeadLine />
      <Body>
        <ValueLayout>
          <ValueTitle>총 휴가</ValueTitle>
          <ValueText>{totalHolidayCount}</ValueText>
        </ValueLayout>
        <ValueLayout>
          <ValueTitle>출근일수</ValueTitle>
          <ValueText>{attenCount}</ValueText>
        </ValueLayout>
      </Body>
    </Container>
  );
}

export default Group;