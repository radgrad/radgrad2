import React from 'react';

interface IWidgetHeaderNumberProps {
  inputValue: number;
}

const WidgetHeaderNumber = (props: IWidgetHeaderNumberProps) => (
  <span className="radgrad-header-number">&middot; {props.inputValue} </span>
);

export default WidgetHeaderNumber;
