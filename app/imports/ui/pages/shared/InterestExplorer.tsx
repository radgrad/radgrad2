import * as React from 'react';
import {Container, Header} from 'semantic-ui-react';
import ExplorerInterestsWidget from "../../components/shared/ExplorerInterestsWidget";
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import FirstMenuContainer from "./FirstMenu";
import SecondMenuContainer from "./SecondMenu";
import FacultyPageMenuWidget from "../faculty/FacultyExplorerPage";

/** A simple static component to render some text */
class InterestExplorerPage extends React.Component{
  constructor(props) {
    super(props);
  }
  public render() {
    console.log('This is the InterestExplorer.tsx');
    return (
      <div>
        <FacultyPageMenuWidget/>
        <Container>
          <Header as='h1'>
            The Interest Explorer Pages should go here.
          </Header>
          <ExplorerInterestsWidget/>
        </Container>
      </div>
    );
  }
}

const InterestExplorerPageCon = withGlobalSubscription(InterestExplorerPage);
const InterestExplorerPageContainer = withInstanceSubscriptions(InterestExplorerPageCon);

export default InterestExplorerPageContainer;
