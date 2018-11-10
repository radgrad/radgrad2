import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { ILoading } from './WithGlobalSubscriptions';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';

export function withPublicStatsSubscription(WrappedComponent) {
  console.log(`withPublicStatsSubscription(${WrappedComponent}`);
  class PubStatsSubscription extends React.Component<ILoading> {
    constructor(props) {
      super(props);
      console.log(`PubStatsSubscription ${props}`);
    }

    /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
    public render() {
      console.log(`PubStatsSubscription loading = ${this.props.loading}`);
      return (this.props.loading) ? <Loader active={true}>Getting public data</Loader> : <WrappedComponent {...this.props}/>;
    }
  }
  return withTracker(() => {
    const sub1 = Meteor.subscribe(PublicStats.getPublicationName());
    return {
      loading: !sub1.ready(),
    };
  })(PubStatsSubscription);
}
