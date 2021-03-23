import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { closeAlert } from '../actions/alert';
import { useSpring, animated } from 'react-spring';

const BoxLayer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  top: 0px;
  left: 0px;
  overflow: hidden;
  position: fixed;
  z-index: 4000;
`;

const BoxOverlay = styled.div`
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: rgba(50, 50, 50, 0.5);
  position: absolute;
  z-index: 4001;
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 375px;
  min-height: 150px;
  border-radius: 8px;
  background-color: white;
  position: absolute;
  z-index: 4002;
`;

const ContentsBox = styled.span`
  text-align: center;
  text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  font-family: 12LotteMartDream;
  font-size: calc(14px + 1vmin);
  line-height: 1.17;
  font-weight: 400;
  font-color: black;
  word-break: keep-all;
  white-space: pre-line;
`;

const AnimBox = animated(Box);

const Alert = () => {
  const dispatch = useDispatch();
  const { contents } = useSelector(state => state.alertOpenCloseReducer);
  const closeAlertAction = useCallback(() => dispatch(closeAlert()), [dispatch]);
  const animProps = useSpring({
    to: {
      opacity: 1,
      transform: "translate(0px, 0px)"
    },
    from: {
      opacity: 0,
      transform: "translate(0px, 50px)"
    }
  });

  return (
    <BoxLayer>
      <BoxOverlay onClick={closeAlertAction} />
      <AnimBox style={animProps}>
        <ContentsBox>
          {contents}
        </ContentsBox>
      </AnimBox>
    </BoxLayer>
  );
}

export default Alert;