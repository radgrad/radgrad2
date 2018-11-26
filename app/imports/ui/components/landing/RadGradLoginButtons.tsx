import * as React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

class RadGradLoginButtons extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(e) {
    console.log(e.target.parentNode.id);
    console.log('show');
  }

  public render() {
    const adminLabel = '... as admin';
    const mentorLabel = '... as mentor';
    return (
      <Dropdown text="LOGIN" pointing={'top right'}>
        <Dropdown.Menu>
          <Dropdown.Item id={'student'} onClick={this.handleClick}>... as student</Dropdown.Item>
          <Dropdown.Item id={'faculty'} text={'... as faculty'} onClick={this.handleClick}/>
          <Dropdown.Item id={'mentor'} as={NavLink} to="/signin" text={mentorLabel}/>
          <Dropdown.Item id={'advisor'} text={'... as advisor'} onClick={this.handleClick}/>
          <Dropdown.Item id={'admin'} as={NavLink} exact={true} to="/signin" text={adminLabel}/>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default withRouter(RadGradLoginButtons);
