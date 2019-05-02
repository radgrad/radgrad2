import * as React from 'react';
import { Container } from 'semantic-ui-react';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import RetrieveUserWidget from '../../components/admin/RetrieveUserWidget';
import FilterUserWidget from '../../components/shared/FilterUserWidget';

export interface IFilterUsers {
  firstNameRegex?: string;
  lastNameRegex?: string;
  userNameRegex?: string;
}

class AdminHomePage extends React.Component<{}, IFilterUsers> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  public updateFirstNameRegex = (firstNameRegex) => {
    this.setState({ firstNameRegex });
  }

  public updateLastNameRegex = (lastNameRegex) => {
    this.setState({ lastNameRegex });
  }

  public updateUserNameRegex = (userNameRegex) => {
    this.setState({ userNameRegex });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (
      <div>
        <AdminPageMenuWidget/>
        <Container textAlign="center" fluid={false}>
            <FilterUserWidget updateFirstNameRegex={this.updateFirstNameRegex}
                              updateLastNameRegex={this.updateLastNameRegex}
                              updateUserNameRegex={this.updateUserNameRegex}/>
            <RetrieveUserWidget firstNameRegex={this.state.firstNameRegex} lastNameRegex={this.state.lastNameRegex}
                                userNameRegex={this.state.userNameRegex}/>
        </Container>
      </div>
    );
  }
}

export default AdminHomePage;
