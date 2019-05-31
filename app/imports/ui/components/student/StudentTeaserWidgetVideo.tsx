import * as React from 'react';
import { Embed } from 'semantic-ui-react';

interface IStudentTeaserWidgetVideoProps {
  teaserUrl: string;
}

class StudentTeaserWidgetVideo extends React.Component<IStudentTeaserWidgetVideoProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const embedStyle = {
      width: '290px',
      height: 'auto',
    };
    return (
      <Embed active={true} autoplay={false} style={embedStyle} source="youtube" id={this.props.teaserUrl}/>
    );
  }
}

export default StudentTeaserWidgetVideo;
