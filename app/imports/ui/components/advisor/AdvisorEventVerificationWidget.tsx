import * as React from 'react';
import { Segment, Header } from 'semantic-ui-react';

interface IAdvisorPendingVerificationWidgetProps {
}

class AdvisorEventVerificationWidget extends React.Component<IAdvisorPendingVerificationWidgetProps> {

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Segment>
        <Header as={'h4'} dividing content={'EVENT VERIFICATION'}/>
      </Segment>
    );
  }
}

export default AdvisorEventVerificationWidget;
