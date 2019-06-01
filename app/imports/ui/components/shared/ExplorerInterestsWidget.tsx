import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';

interface IExplorerInterestsWidgetProps {
  match?: {
    params: {
      id: string;
      name: string;
      url: string;
    }
  }
}

// don't know if we'll need this because state may not change
interface IExplorerInterestsWidgetState {

}

class ExplorerInterestsWidget extends React.Component <IExplorerInterestsWidgetProps, IExplorerInterestsWidgetState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <Container>
        <div className='ui padded container segment'>
          <Header as = 'h4'>
          The Explorer Interest Widget should go here
          </Header>
          <p>
            The Explorer Interest Widget should the blown up description, title and details for a specific interest
            This widget should be shown on the explorer page. 
          </p>
        </div>
      </Container>
    );
  }
}

export default withRouter(ExplorerInterestsWidget);
