import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Card, Button, Icon, Popup, Image } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import * as _ from 'lodash';
import { IAcademicPlan, IPlanCard } from '../../../typings/radgrad'; // eslint-disable-line
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import ProfileAdd from './ProfileAdd';
import AcademicPlanStaticViewer from './AcademicPlanStaticViewer';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from './RouterHelperFunctions';
import { StudentParticipations } from '../../../api/public-stats/StudentParticipationCollection';
import { Users } from '../../../api/user/UserCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';

class PlanCard extends React.Component<IPlanCard> {
  constructor(props) {
    super(props);
  }

  private itemName = (item: IAcademicPlan): string => item.name;

  private itemShortDescription = (item: IAcademicPlan): string => {
    let description = item.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
      if (description.charAt(description.length - 1) === ' ') {
        description = `${description.substring(0, 199)}`;
      }
    }
    return description;
  }

  private numberStudents = (item: IAcademicPlan): number => {
    const participatingStudents = StudentParticipations.findDoc({ itemID: item._id });
    return participatingStudents.itemCount;
  }

  private interestedStudentsHelper = (item: IAcademicPlan, type: string): object[] => {
    const interested = [];
    let instances = StudentProfiles.findNonRetired({ isAlumni: false });

    if (type === EXPLORER_TYPE.ACADEMICPLANS) {
      instances = _.filter(instances, (profile) => profile.academicPlanID === item._id);
    }
    instances = _.filter(instances, (profile) => profile.picture && profile.picture !== defaultProfilePicture);
    _.forEach(instances, (p) => {
      if (!_.includes(interested, p.userID)) {
        interested.push(p.userID);
      }
    });
    // only allow 50 students randomly selected.
    for (let i = interested.length - 1; i >= 50; i--) {
      interested.splice(Math.floor(Math.random() * interested.length), 1);
    }
    return interested;
  }

  private studentPicture = (studentID) => {
    if (studentID === 'elipsis') {
      return '/images/elipsis.png';
    }
    return Users.getProfile(studentID).picture;
  }

  private studentFullName = (studentID) => {
    if (studentID === 'elispsis') {
      return '';
    }
    return Users.getFullName(studentID);
  }

  private buildRouteName = (slug: string): string => {
    const route = Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${slug}`);
    return route;
  }

  private itemSlug = (item: IAcademicPlan): string => Slugs.findDoc(item.slugID).name;

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { type, canAdd, item } = this.props;
    const itemName = this.itemName(item);
    const itemShortDescription = this.itemShortDescription(item);
    const numberStudents = this.numberStudents(item);
    const itemSlug = this.itemSlug(item);
    const interestedStudents = this.interestedStudentsHelper(item, type);

    return (
      <Card className="radgrad-interest-card">
        <Card.Content>
          <Card.Header>{itemName}</Card.Header>
        </Card.Content>

        <Card.Content>
          <Markdown escapeHtml={true} source={`${itemShortDescription}...`}/>
          <AcademicPlanStaticViewer plan={item}/>
        </Card.Content>

        <Card.Content>
          <span>STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents}/></span>
          <Image.Group size="mini">
            {interestedStudents.map((student, index) => <Popup
              key={index}
              trigger={<Image src={this.studentPicture(student)} circular={true} bordered={true}/>}
              content={this.studentFullName(student)}
            />)}
          </Image.Group>
        </Card.Content>

        <Button.Group className="radgrad-home-buttons center aligned" attached="bottom" widths={2}>
          <Link className="ui button" to={this.buildRouteName(itemSlug)}>
            <Icon name="chevron circle right"/><br/>View More
          </Link>
        </Button.Group>
      </Card>
    );
  }
}

export default withRouter(PlanCard);
