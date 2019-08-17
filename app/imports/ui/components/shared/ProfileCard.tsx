import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withRouter, Link } from 'react-router-dom';
import { Card, Icon, Image, Popup } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import * as Markdown from 'react-markdown';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import * as Router from './RouterHelperFunctions';
import { EXPLORER_TYPE, URL_ROLES } from '../../../startup/client/routes-config';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { StudentParticipations } from '../../../api/public-stats/StudentParticipationCollection';

interface IProfileCardProps {
  item: {
    _id: string;
  };
  type: string;
  canAdd: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  profile: object;
}

class ProfileCard extends React.Component<IProfileCardProps> {
  constructor(props) {
    super(props);
  }

  private itemName = (item) => item.name;

  private itemSlug = (item) => Slugs.findDoc(item.slugID).name;

  private itemShortDescription = (item) => {
    let description = item.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
      if (description.charAt(description.length - 1) === ' ') {
        description = `${description.substring(0, 199)}`;
      }
    }
    return description;
  };

  private getUsername = () => Router.getUsername(this.props.match);

  private buildRouteName = (item) => {
    const itemSlug = this.itemSlug(item);
    const username = this.getUsername();
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;
    const { type } = this.props;
    switch (type) {
      case EXPLORER_TYPE.CAREERGOALS:
        return `${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${itemSlug}`;
      case EXPLORER_TYPE.COURSES:
        return `${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemSlug}`;
      case EXPLORER_TYPE.DEGREES:
        return `${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}/${itemSlug}`;
      case EXPLORER_TYPE.INTERESTS:
        return `${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${itemSlug}`;
      case EXPLORER_TYPE.OPPORTUNITIES:
        return `${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemSlug}`;
      default:
        break;
    }
    return '#';
  };

  private numberUsers = (interest) => {
    const participatingUsers = StudentParticipations.findDoc({ itemID: interest._id });
    return participatingUsers.itemCount;
  }

  private interestedStudents = (item) => this.interestedStudentsHelper(item, this.props.type);

  private interestedStudentsHelper = (item, type) => {
    const interested = [];
    let instances = StudentProfiles.findNonRetired({ isAlumni: false });
    if (type === EXPLORER_TYPE.CAREERGOALS) {
      instances = _.filter(instances, (profile) => _.includes(profile.careerGoalIDs, item._id));
    } else if (type === EXPLORER_TYPE.INTERESTS) {
      instances = _.filter(instances, (profile) => _.includes(profile.interestIDs, item._id));
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

  private getInterestDoc = () => {
    const { item } = this.props;
    return item;
  };

  private addInterest = () => {
    const user = Users.getProfile(this.getUsername());
    const interestIDsOfUser = user.interestIDs;
    const interestID = this.getInterestDoc()._id;
    const currentInterestID = [interestID];
    const dataValue = [interestIDsOfUser, currentInterestID];
    const updateValue = _.flatten(dataValue);
    return updateValue;
  };

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

  private getRoleByUrl = (): string => Router.getRoleByUrl(this.props.match)

  private getCollectionName = () => {
    let name;
    switch (this.getRoleByUrl()) {
      case URL_ROLES.STUDENT:
        name = StudentProfiles.getCollectionName();
        break;
      case URL_ROLES.FACULTY:
        name = FacultyProfiles.getCollectionName();
        break;
      case URL_ROLES.ALUMNI:
        name = StudentProfiles.getCollectionName();
        break;
      case URL_ROLES.MENTOR:
        name = MentorProfiles.getCollectionName();
        break;
      default:
        break;
    }
    return name;

  };


  private handleClick = () => {
    const newInterestsAfterAdd = this.addInterest();
    const updateDataAdd: any = {
      id: Users.getProfile(this.getUsername())._id,
      interests: newInterestsAfterAdd,
    };
    const collectionNameAdd = this.getCollectionName();
    updateMethod.call({ collectionName: collectionNameAdd, updateData: updateDataAdd }, (error) => {
      if (error) {
        Swal.fire({
          title: 'Update failed',
          text: error.message,
          type: 'error',
        });
        console.error('Error in updating. %o', error);
      } else {
        Swal.fire({
          title: 'Update succeeded',
          type: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });


  };


  /**
   * in ../imports/ui/shared/CardExplorerWidget.tsx the Interest Profile card needs to have:
   * a type, a canAdd method that returns true and match
   */
  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { item, match } = this.props;
    const itemName = this.itemName(item);
    const itemShortDescription = this.itemShortDescription(item);
    const numberStudents = this.numberUsers(item);
    const interestedStudents = this.interestedStudents(item);

    return (
      <Card className='radgrad-interest-card'>
        <Card.Content>
          <Card.Header>{itemName}</Card.Header>
        </Card.Content>
        <Card.Content>
          <Markdown escapeHtml={true} source={`${itemShortDescription}...`}
                    renderers={{ link: (props) => Router.renderLink(props, match) }}/>
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
        <div className="radgrad-home-buttons ui center aligned two bottom attached buttons">
          <Link to={this.buildRouteName(this.props.item)} className='ui button'>
            <Icon name='chevron circle right'/>
            <br/>
            View More
          </Link>
        </div>
      </Card>
    );
  }
}


export default withRouter(ProfileCard);
