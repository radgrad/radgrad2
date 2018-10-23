import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

class RadGradLoginButtons extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(e) {
    console.log(e.target.parentNode.id);
  }

  public render() {
    return (
      <Dropdown text={'LOGIN'}>
        <Dropdown.Menu>
          <Dropdown.Item id={'student'} text={'... as student'} onClick={this.handleClick}/>
          <Dropdown.Item id={'faculty'} text={'... as faculty'} onClick={this.handleClick}/>
          <Dropdown.Item id={'mentor'} text={'... as mentor'} onClick={this.handleClick}/>
          <Dropdown.Item id={'advisor'} text={'... as advisor'} onClick={this.handleClick}/>
          <Dropdown.Item id={'admin'} text={'... as admin'} onClick={this.handleClick}/>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default RadGradLoginButtons;
