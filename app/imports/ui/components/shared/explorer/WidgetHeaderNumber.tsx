import React from 'react';

interface IWidgetHeaderNumberProps {
  inputValue: number;
}

const WidgetHeaderNumber: React.FC<IWidgetHeaderNumberProps> = ({ inputValue }) => (
  <span className="radgrad-header-number">
    &middot; {inputValue}
  </span>
);

export default WidgetHeaderNumber;
