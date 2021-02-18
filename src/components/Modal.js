import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { closeModal } from '../actions/modal';
import CloseIcon from '@material-ui/icons/Close';

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
  z-index: 1000;
`;

const BoxOverlay = styled.div`
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: rgba(50, 50, 50, 0.5);
  position: absolute;
  z-index: 1001;
`;

const Box = styled.div`
  display: flex;
  width: 100%;
  max-width: ${props => props.defaultWdith || "375"}px;
  height: 100%;
  max-height: ${props => props.defaultHeight || "400"}px;
  border-radius: 20px;
  background-color: white;
  position: absolute;
  z-index: 1002;

  @media (max-width: ${props => props.defaultWdith || "375"}px) {
    border-radius: 0px;
  }
`;

const CloseBtn = styled(CloseIcon)`
  width: 30px;
  height: auto;
  top: 17px;
  right: 16px;
  position: absolute;
  z-index: 1003;
  cursor: pointer;
`;

const AnimBox = animated(Box);

const Modal = () => {
  const dispatch = useDispatch();
  const closeModalAction = useCallback(() => dispatch(closeModal()), [dispatch]);
  const { contents = <div>모달의 컨텐츠가 없습니다.</div>, width, height, close = true, backdrop = false } = useSelector(state => state.modalOpenCloseReducer);
  const animProps = useSpring({
    to: {
      opacity: 1,
      transform: "translate(0px, 0px)"
    },
    from: {
      opacity: 0,
      transform: "translate(0px, -50px)"
    }
  });

  const nullEvent = useCallback(() => null, []);

  return (
    <BoxLayer>
      <BoxOverlay onClick={backdrop ? closeModalAction : nullEvent} />
      <AnimBox defaultWdith={width} defaultHeight={height} style={animProps}>
        {close && <CloseBtn onClick={closeModalAction} />}
        {contents}
      </AnimBox>
    </BoxLayer>
  );
}

export default Modal;