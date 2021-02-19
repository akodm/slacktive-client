import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';

const Loadmask = () => {
  const { loadmask } = useSelector(state => state.loadmaskOnOffReducer);

  return (
    <Backdrop open={loadmask} style={{ zIndex: "3000" }}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
}

export default Loadmask;