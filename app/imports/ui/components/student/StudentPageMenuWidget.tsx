import * as React from 'react';
import { withRouter } from 'react-router-dom';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import SecondMenu from '../../pages/shared/SecondMenu';

interface IStudentPageMenuWidgetProps {
  match?: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class StudentPageMenuWidget extends React.Component<IStudentPageMenuWidgetProps> {
  public render() {
    const menuItems = [
      { label: 'Home', route: 'home' },
      { label: 'Explorer', route: 'explorer' },
      { label: 'Degree Planner', route: 'degree-planner' },
      { label: 'Mentor Space', route: 'mentor-space' },
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
export default withRouter(StudentPageMenuWidget);
