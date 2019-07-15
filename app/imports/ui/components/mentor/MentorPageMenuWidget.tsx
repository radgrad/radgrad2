import * as React from 'react';
import { withRouter } from 'react-router-dom';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import SecondMenu from '../../pages/shared/SecondMenu';

interface IMentorPageMenuWidgetProps {
  match?: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class MentorPageMenuWidget extends React.Component<IMentorPageMenuWidgetProps> {
  public render() {
    const divStyle = { marginBottom: 30 };

    const menuItems = [
      { label: 'Home', route: 'home' },
      { label: 'Mentor Space', route: 'mentor-space' },
      { label: 'Explorer', route: 'explorer' },
    ];
    return (
      <div style={divStyle}>
        <FirstMenuContainer/>
        <SecondMenu menuItems={menuItems} numItems={menuItems.length}/>
      </div>
    );
  }
}

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(MentorPageMenuWidget);
