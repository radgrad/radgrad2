import * as React from 'react';
import { Container } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import SecondMenu from '../shared/SecondMenu';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import RetrieveUserWidget from '../../components/admin/RetrieveUserWidget';

/** A simple static component to render some text for the landing page. */
class AdminHomePage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (
      <div>
        <AdminPageMenuWidget/>
        <Container textAlign="center" fluid={false}>
          <RetrieveUserWidget/>
        </Container>
      </div>
    );
  }
}

const AdminHomePageCon = withGlobalSubscription(AdminHomePage);
const AdminHomePageContainer = withInstanceSubscriptions(AdminHomePageCon);

export default AdminHomePageContainer;
