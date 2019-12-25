import React from 'react';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { _ } from 'meteor/erasaur:meteor-lodash'; // CAM: replacing this with lodash causes a typescript error
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';

interface ILoading {
  loading: boolean;
}

// cacheLimit default is 10, so increased to handle all our subscriptions.
// expireLimit set to 30 minutes because: why not.
const additionalSubs = new SubsManager({ cacheLimit: 2, expireIn: 30 });

function withAdditionalSubscriptions(WrappedComponent) {
  const AdditionalSubscriptions = (props: ILoading) => ((props.loading) ? <Loader active>Getting additional data</Loader> :
  <WrappedComponent {...this.props} />);

  return withTracker(() => {
    const requests = VerificationRequests.find({}).fetch();
    const studentIDs = _.uniq(_.map(requests, (r) => r.studentID));
    const handle = additionalSubs.subscribe(OpportunityInstances.publicationNames.verification, studentIDs);
    const loading = !handle.ready();
    return {
      loading,
    };
  })(AdditionalSubscriptions);
}
export default withAdditionalSubscriptions;
