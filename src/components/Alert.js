import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { closeAlert } from '../actions/alert';

const Box = styled.div`
  width: 375px;
  min-height: 150px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 1px 1px 1px 1px black;

  @media (max-width: 375px) {
    width: 100%;
  }
`;

function Alert(props) {
  const dispatch = useDispatch();
  const { modal } = useSelector(state => state.modalOpenCloseReducer);
  const closeAlertAction = useCallback(() => dispatch(closeAlert), [dispatch]);
  
  console.log(modal);

  return (
    <Box onClick={closeAlertAction}>
      
    </Box>
  );
}

export default Alert;