import React from 'react';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';

interface Loading {
  loading: boolean;
}

const withListSubscriptions = (WrappedComponent, subscriptionNames: string[]) => {
  // cacheLimit default is 10, so increased to handle all our subscriptions.
  // expireLimit set to 30 minutes because: why not.
  const localSubs = new SubsManager({ cacheLimit: subscriptionNames.length, expireIn: 30 });

  const GenericSubscription: React.FC<Loading> = (props) => (props.loading ? <Loader active>Getting data</Loader> : <WrappedComponent {...props} />);

  return withTracker(() => {
    const handles = [];
    // console.log(subscriptionNames);
    subscriptionNames.forEach((name) => handles.push(localSubs.subscribe(name)));
    const loading = handles.some((handle) => !handle.ready());
    return {
      loading,
    };
  })(GenericSubscription);
};

export default withListSubscriptions;
