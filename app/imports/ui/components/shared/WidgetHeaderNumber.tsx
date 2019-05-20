import * as React from 'react';

interface IWidgetHeaderNumberProps {
  inputValue: number;
}

class WidgetHeaderNumber extends React.Component<IWidgetHeaderNumberProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
        <span className="radgrad-header-number">&middot; {this.props.inputValue} </span>
    );
  }
}

export default WidgetHeaderNumber;
