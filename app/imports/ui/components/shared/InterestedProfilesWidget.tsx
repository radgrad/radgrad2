import * as React from 'react';
import { Container, Header, Button, Grid, Image, Popup, Divider, Segment } from 'semantic-ui-react';
import { IProfile } from '../../../typings/radgrad';

interface IInterestedProfileWidgetProps {
  students: IProfile[],
  faculty: IProfile[],
  alumni: IProfile[],
  mentors: IProfile[],
}

class InterestedProfilesWidget extends React.Component<IInterestedProfileWidgetProps> {
  constructor(props) {
    super(props);
    console.log(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Segment>Foo</Segment>
    );
  }
}

export default InterestedProfilesWidget;
