import React from 'react';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { _ } from 'meteor/erasaur:meteor-lodash'; // CAM: replacing this with lodash causes a typescript error
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';

interface Loading {
  loading: boolean;
}

// cacheLimit default is 10, so increased to handle all our subscriptions.
// expireLimit set to 30 minutes because: why not.
const additionalSubs = new SubsManager({ cacheLimit: 2, expireIn: 30 });

const withAdditionalSubscriptions = (WrappedComponent) => {
  const AdditionalSubscriptions: React.FC<Loading> = (props) => (props.loading ? <Loader active>Getting additional data</Loader> : <WrappedComponent {...props} />);

  return withTracker(() => {
    const requests = VerificationRequests.findNonRetired({});
    const studentIDs = _.uniq(requests.map((r) => r.studentID));
    const handle = additionalSubs.subscribe(OpportunityInstances.publicationNames.verification, studentIDs);
    const loading = !handle.ready();
    return {
      loading,
    };
  })(AdditionalSubscriptions);
};

export default withAdditionalSubscriptions;
