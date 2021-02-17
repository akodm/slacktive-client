import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const Calendar = props => {
  const { 
    value = {
      title: "",
      contents: "",
      start: "",
      end: "",
      startIsEnd: false,
      category: "",
      isAllDay: false,
    }, 
  } = props;
  const [ values, setValues ] = useState(value); 

  const onChangeCalendarModalValue = useCallback((e) => {
    const items = { ...values };
    items[e.target.id] = e.target.value;
    setValues({ ...items });
  }, [values]);

  // <input type="text" value={values.title} id="title" onChange={onChangeCalendarModalValue} />

  return (
    <Container>

    </Container>
  );
}

export default Calendar;