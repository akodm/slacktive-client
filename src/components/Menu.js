import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined';
import ListOutlinedIcon from '@material-ui/icons/ListOutlined';

const Container = styled.div`
  width: 90px;
  height: 100%;
  box-shadow: 3px 2px 8px 0px rgba(0, 0, 0, 0.16);
  left: 0px;
  position: fixed;

  @media (max-width: 500px) {
    width: 100vw;
    height: 40px;
    left: 0px;
    bottom: 0px;
    background-color: white;
    position: fixed;
    z-index: 1000;
  }
`;

const ButtonWrapper = styled.div`
  padding-top: 71px;
  
  @media (max-width: 500px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 0px;
  }
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  cursor: pointer;
  transition: transform ease 0.2s 0s;

  &:active {
    transform: scale(1.4);
  }

  @media (max-width: 500px) {
    width: 25%;
    height: 40px;
  }
`;

const SideBorder = styled.div`
  width: 5px;
  height: 60px;
  background-color: white;
  right: 0px;
  transform: translate(0px, ${props => props.position || "0"}px);
  transition: transform ease 0.3s 0s;
  position: absolute;

  @media (max-width: 500px) {
    display: none;
  }
`;

const CalendarIcon = styled(DateRangeOutlinedIcon)`
  color: white;
  @media (max-width: 500px) {
    color: ${props => props.index === 0 ? "#6c84ff" : "#777777"};
  }
`;
const ProfileIcon = styled(AccountCircleOutlinedIcon)`
  color: white;
  @media (max-width: 500px) {
    color: ${props => props.index === 1 ? "#6c84ff" : "#777777"};
  }
`;
const CompanyIcon = styled(BusinessOutlinedIcon)`
  color: white;
  @media (max-width: 500px) {
    color: ${props => props.index === 2 ? "#6c84ff" : "#777777"};
  }
`;
const EtcIcon = styled(ListOutlinedIcon)`
  color: white;
  @media (max-width: 500px) {
    color: ${props => props.index === 3 ? "#6c84ff" : "#777777"};
  }
`;

const buttonSliderBarHeight = 60;

function Menu(props) {
  const { path } = props;
  const [ color, setColor ] = useState(0);
  const history = useHistory();

  useEffect(() => {
    if(path === "/calendar") {
      setColor(0);
    }
    if(path === "/my") {
      setColor(1);
    }
    if(path === "/group") {
      setColor(2);
    }
    if(path === "/etc") {
      setColor(3);
    }
  }, [path]);

  const menus = useMemo(() => [
    { key: "/calendar", icon: <CalendarIcon index={color}/>, onClick: () => history.replace("/calendar") },
    { key: "/my", icon: <ProfileIcon index={color}/>, onClick: () => history.replace("/my") },
    { key: "/group", icon: <CompanyIcon index={color}/>, onClick: () => history.replace("/group") },
    { key: "/etc", icon: <EtcIcon index={color}/>, onClick: () => history.replace("/etc") },
  ], [history, color]);

  const position = useMemo(() => {
    return buttonSliderBarHeight * color;
  }, [color]);

  return (
    <Container>
      <ButtonWrapper>
        <SideBorder position={position} />
        {
          menus && menus.map(btns => {
            return <Button key={btns.key} onClick={btns.onClick}>
              { btns.icon }
            </Button>
          })
        }
      </ButtonWrapper>
    </Container>
  );
}

export default Menu;