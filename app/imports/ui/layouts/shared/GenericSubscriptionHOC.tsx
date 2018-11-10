import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';

interface ILoading {
  loading: boolean;
}

export function withGenericSubscriptions(WrappedComponent, subscriptionNames: string[]) {
  class GenericSubscription extends React.Component<ILoading> {
    constructor(props) {
      super(props);
    }

    /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
    public render() {
      return (this.props.loading) ? <Loader active={true}>Getting data</Loader> : <WrappedComponent {...this.props}/>;
    }
  }
  return withTracker(() => {
    const handles = [];
    // console.log(subscriptionNames);
    subscriptionNames.forEach((name) => handles.push(Meteor.subscribe(name)));
    const loading = handles.some((handle) => !handle.ready());
    return {
      loading,
    };
  })(GenericSubscription);
}

export default withGenericSubscriptions;
