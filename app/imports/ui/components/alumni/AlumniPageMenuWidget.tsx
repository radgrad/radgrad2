import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import SecondMenu from '../../pages/shared/SecondMenu';

interface IAlumniPageMenuWidgetProps {
  match?: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class AlumniPageMenuWidget extends React.Component<IAlumniPageMenuWidgetProps> {
  public render() {
    const menuItems = [
      { label: 'Home', route: 'home' },
      { label: 'Alumni Space', route: 'alumni-space' },
      { label: 'Explorer', route: 'explorer' },
    ];
    return (
      <div>
        <FirstMenuContainer/>
        <SecondMenu menuItems={menuItems} numItems={menuItems.length}/>
      </div>
    );
  }
}

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(AlumniPageMenuWidget);
