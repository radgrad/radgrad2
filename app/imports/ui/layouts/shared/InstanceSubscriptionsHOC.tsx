import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Dimmer, Loader, Responsive } from 'semantic-ui-react';
import { getUserIdFromRoute } from '../../components/shared/RouterHelperFunctions';
import PageLoaderMobile from '../../components/shared/PageLoaderMobile';
import { getInstancePubSubLiteHandles } from '../../../startup/both/pub-sub';

interface ILoading {
  loading: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

// cacheLimit default is 10, so no change.
// expireLimit set to 30 minutes because: why not.
// const instanceSubs = new SubsManager({ cacheLimit: 15, expireIn: 30 });

function withInstanceSubscriptions(WrappedComponent) {
  // eslint-disable-next-line react/prop-types
  const InstanceSubscriptions = (props: ILoading) => ((props.loading) ? (
    <React.Fragment>
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Dimmer active inverted><Loader>Loading user-specific data</Loader></Dimmer>
      </Responsive>

      <Responsive {...Responsive.onlyMobile}>
        <PageLoaderMobile />
      </Responsive>
    </React.Fragment>
  )
    :
    <WrappedComponent {...props} />);

  return withTracker((props) => {
    let handles = [];
    if (props.match) {
      const userID = getUserIdFromRoute(props.match);
      if (userID) { // if logged out don't subscribe
        handles = getInstancePubSubLiteHandles(userID);
      }
    }
    const loading = handles.some((handle) => !handle.ready());
    return {
      loading,
    };
  })(InstanceSubscriptions);
}

export default withInstanceSubscriptions;
