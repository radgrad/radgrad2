import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Button, Label } from 'semantic-ui-react';
import { ICourseInstance } from '../../../typings/radgrad';

interface ICourseInstancePillProps {
  instance: ICourseInstance;
  handleClickCourseInstance: (event, { value }) => any;
}

class CourseInstancePill extends React.Component<ICourseInstancePillProps> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(event) {
    event.preventDefault();
    this.props.handleClickCourseInstance(event, { value: this.props.instance._id });
  }

  public render() {
    return (
      <Button basic={true} color="grey" size="tiny" onClick={this.handleClick}>
        {this.props.instance.note}
      </Button>
    );
  }
}

export default CourseInstancePill;
