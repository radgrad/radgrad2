import React from 'react';

interface WidgetHeaderNumberProps {
  inputValue: number;
}

const WidgetHeaderNumber: React.FC<WidgetHeaderNumberProps> = ({ inputValue }) => <span className="radgrad-header-number">&middot; {inputValue}</span>;

export default WidgetHeaderNumber;
