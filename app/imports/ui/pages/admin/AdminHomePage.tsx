import React from 'react';
import { Container, Button } from 'semantic-ui-react';
import * as _ from 'lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import RetrieveUserWidget from '../../components/admin/RetrieveUserWidget';
import FilterUserWidget from '../../components/shared/FilterUserWidget';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { pageInterestFindMethod } from '../../../api/page-tracking/PageInterestCollection.methods';

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

  // TODO: remove after done with issue-138
  private handleClick = (e) => {
    e.preventDefault();
    userInteractionFindMethod.call({}, (error, result) => {
      const userInteractions = _.groupBy(result, 'username');
      console.log('userInteractions %o', userInteractions);
    });
    pageInterestFindMethod.call({}, (error, result) => {
      const pageInterests = _.groupBy(result, 'username');
      console.log('pageInterests %o', pageInterests);
    });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (
      <div>
        <AdminPageMenuWidget />
        <Container textAlign="center" fluid={false}>
          {/* TODO: remove after done with issue-158 */}
          <Button onClick={this.handleClick}>User Interactions</Button>
          <FilterUserWidget
            updateFirstNameRegex={this.updateFirstNameRegex}
            updateLastNameRegex={this.updateLastNameRegex}
            updateUserNameRegex={this.updateUserNameRegex}
          />
          <RetrieveUserWidget
            firstNameRegex={this.state.firstNameRegex}
            lastNameRegex={this.state.lastNameRegex}
            userNameRegex={this.state.userNameRegex}
          />
        </Container>
      </div>
    );
  }
}

export default AdminHomePage;
