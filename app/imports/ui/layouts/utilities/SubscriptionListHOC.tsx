import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';

interface ILoading {
  loading: boolean;
}

const withListSubscriptions = (WrappedComponent, subscriptionNames: string[]) => {
  // console.log(subscriptionNames);
  // cacheLimit default is 10, so increased to handle all our subscriptions.
  // expireLimit set to 30 minutes because: why not.
  const localSubs = new SubsManager({ cacheLimit: subscriptionNames.length, expireIn: 30 });

  const GenericSubscription: React.FC<ILoading> = (props) => ((props.loading) ? (
    <React.Fragment>
      <Dimmer active inverted>
        <Loader>Loading data</Loader>
      </Dimmer>
    </React.Fragment>
  ) : <WrappedComponent {...props} />);

  return withTracker(() => {
    const handles = [];
    subscriptionNames.forEach((name) => handles.push(localSubs.subscribe(name)));
    const loading = handles.some((handle) => !handle.ready());
    console.log(subscriptionNames, loading);
    return {
      loading,
    };
  })(GenericSubscription);
};

export default withListSubscriptions;
