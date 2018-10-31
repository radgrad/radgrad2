import * as React from 'react';
import { Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ILoading } from './WithGlobalSubscriptions';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';

class WithAdvisorSubscriptions extends React.Component<ILoading, {}> {
  /**
   * Creates a new WithAdvisorSubscriptions Component.
   * @param props the Properties.
   */
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.loading) ? <Loader active={true}>Getting global data</Loader> : this.renderPage();
  }

  public renderPage() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default withTracker(() => {
  const sub1 = Meteor.subscribe(PlanChoices.getPublicationName());
  return {
    loading: !sub1.ready(),
  };
})(WithAdvisorSubscriptions);
