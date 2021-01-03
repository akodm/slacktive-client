import React from 'react';
import styled from 'styled-components';
import { useTransition, animated } from 'react-spring';

const AnimatedWrapperDiv = animated(styled.div`
  display: flex;
  height: 100%;
  margin-left: 90px;
  margin-bottom: 0px;

  @media (max-width: 375px) {
    margin-left: 0px;
    margin-bottom: 40px;
  }
`);

function PageAnim(props) {
  const { children } = props;
  const animProps = useTransition(null, null, {
    enter: {
      opacity: 1,
      transform: "translate(0px, 0px)"
    },
    from: {
      opacity: 0,
      transform: "translate(0px, 30px)"
    },
    leave: {
      opacity: 0,
      transform: "translate(0px, 0px)"
    }
  });
  return (
    animProps.map(({ item, key, props }) => {
      return <AnimatedWrapperDiv key={key} style={props}>
        { children }
      </AnimatedWrapperDiv>
    })
  );
}

export const AnimatedWrapper = React.memo(PageAnim);