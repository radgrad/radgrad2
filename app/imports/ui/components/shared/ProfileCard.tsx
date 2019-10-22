import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withRouter, Link } from 'react-router-dom';
import { Card, Icon, Image, Popup } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import * as Markdown from 'react-markdown';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import ProfileAdd from './ProfileAdd';
import * as Router from './RouterHelperFunctions';
import { URL_ROLES } from '../../../startup/client/routes-config';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import {
  docToName,
  docToShortDescription, profileIDToFullname,
  profileIDToPicture,
  studentsParticipating,
} from './data-model-helper-functions';
import { buildExplorerRoute, interestedStudents } from './explorer-helper-functions';

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

  private addInterest = () => {
    const user = Users.getProfile(Router.getUsername(this.props.match));
    const interestIDsOfUser = user.interestIDs;
    const interestID = this.props.item._id;
    const currentInterestID = [interestID];
    const dataValue = [interestIDsOfUser, currentInterestID];
    const updateValue = _.flatten(dataValue);
    return updateValue;
  };


  private getCollectionName = () => {
    let name;
    switch (Router.getRoleByUrl(this.props.match)) {
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
      id: Users.getProfile(Router.getUsername(this.props.match))._id,
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
    const { item, type, canAdd, match } = this.props;
    const itemName = docToName(item);
    const itemShortDescription = docToShortDescription(item);
    const numberStudents = studentsParticipating(item);
    const interested = interestedStudents(item, type);

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
            {interested.map((student, index) => <Popup
              key={index}
              trigger={<Image src={profileIDToPicture(student)} circular={true} bordered={true}/>}
              content={profileIDToFullname(student)}
            />)}
          </Image.Group>
        </Card.Content>
        <div className="radgrad-home-buttons ui center aligned two bottom attached buttons">
          <Link to={buildExplorerRoute(this.props.item, this.props)} className='ui button'>
            <Icon name='chevron circle right'/>
            <br/>
            View More
          </Link>
          {canAdd && <ProfileAdd item={item} type={type}/>}
        </div>
      </Card>
    );
  }
}


export default withRouter(ProfileCard);
