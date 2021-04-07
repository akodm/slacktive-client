import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

const Box = styled.div`
  display: flex;
  flex-direction: ${props => !props.toggle ? "row" : "row-reverse"};
  justify-content: space-evenly;
  align-items: center;
  min-width: ${props => props.width_ || "84"}px;
  min-height: 30px;
  border-radius: 27.5px;
  background-color: ${props => !props.toggle ? "#2e3681" : "#812e2e"};
  cursor: pointer;
  transition-property: background-color, flex-direction, transform;
  transition: ease 0.3s 0s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Circle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ffffff;
`;

const Text = styled.div`
  font-family: NanumBarunGothic;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
`;

const month = "월평균";
const year = "연평균";

function Toggle(props) {
  const { toggle = false, onClick, on = year, off = month, width = 84 } = props;

  const text = useMemo(() => toggle ? on : off, [toggle, on, off]);

  const onClickFunction = useCallback(() => {
    onClick && onClick();
  }, [onClick]);

  return (
    <Box width_={width} toggle={toggle} onClick={onClickFunction}>
      <Circle />
      <Text>{text}</Text>
    </Box>
  );
}

export default Toggle;