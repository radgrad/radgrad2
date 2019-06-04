import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { Slugs } from '../../../api/slug/SlugCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';

interface IExplorerDegreesPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      degree: string;
    }
  };
}

class ExplorerDegreesPage extends React.Component<IExplorerDegreesPageProps> {
  constructor(props) {
    super(props);
  }

  private degree = () => {
    const degreeSlugName = this.props.match.params.degree;
    const slug = Slugs.find({ name: degreeSlugName }).fetch();
    const degree = DesiredDegrees.findNonRetired({ slugID: slug[0]._id });
    return degree[0];
  }

  private slugName = (slugID) => Slugs.findDoc(slugID).name;

  private descriptionPairs = (degree) => [{ label: 'Description', value: degree.description }]

  private socialPairs = (degree) => [{
    label: 'students',
    amount: this.numUsers(degree),
    value: this.interestedUsers(degree),
  }]

  private interestedUsers = (degree) => {
    const interested = [];
    const profiles = Users.findProfilesWithRole(ROLE.STUDENT, {}, {});
    _.forEach(profiles, (profile) => {
      if (profile.academicPlanID) {
        const plan = AcademicPlans.findDoc(profile.academicPlanID);
        if (_.includes(plan.degreeID, degree._id)) {
          interested.push(profile);
        }
      }
    });
    return interested;
  }

  private numUsers = (degree) => this.interestedUsers(degree).length;

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const degree = this.degree();
    const name = degree.name;
    const slug = this.slugName(degree.slugID);
    const descriptionPairs = this.descriptionPairs(degree);
    const socialPairs = this.socialPairs(degree);
    const id = degree._id;

    return (
      <Grid container={true} stackable={true}>
        <Grid.Row width={3}>
          {/*  TODO: Card Explorer Menu */}
        </Grid.Row>

        <Grid.Row width={13}>
          <ExplorerDegreesWidget name={name} slug={slug} descriptionPairs={descriptionPairs} socialPairs={socialPairs}
                                 id={id} updateID={updateID} item={degree}/>
        </Grid.Row>
      </Grid>
    );
  }
}

const ExplorerDegreesPageCon = withGlobalSubscription(ExplorerDegreesPage);
const ExplorerDegreesPageCont = withInstanceSubscriptions(ExplorerDegreesPageCon);
const ExplorerDegreesPageContainer = withRouter(ExplorerDegreesPageCont);

export default ExplorerDegreesPageContainer;
