import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { withRouter } from 'react-router-dom';
import { Button, Card, Icon, Grid } from 'semantic-ui-react';
import { Slugs } from "../../../api/slug/SlugCollection";
import { Link } from 'react-router-dom';
import * as Markdown from 'react-markdown';
import { StudentProfiles } from "../../../api/user/StudentProfileCollection";
import { Interests } from "../../../api/interest/InterestCollection";
import { Users } from "../../../api/user/UserCollection";
import { updateMethod } from "../../../api/base/BaseCollection.methods";
import Swal from "sweetalert2";
import { FacultyProfiles } from "../../../api/user/FacultyProfileCollection";
import { MentorProfiles } from "../../../api/user/MentorProfileCollection";
import { withTracker } from "meteor/react-meteor-data";
import Container from "semantic-ui-react/dist/commonjs/elements/Container";

/**
 * reference taken from ExplorerCard.tsx written by Gian ../imports/ui/shared/ExplorerCard.tsx
 * think about making generic classes and then inheriting
 */

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

  private routerLink = (props) => (
    props.href.match(/^(https?:)?\/\//)
      ? <a href={props.href}>{props.children}</a>
      : <Link to={props.href}>{props.children}</Link>
  )
  private getUsername = () => this.props.match.params.username;

  private buildRouteName = (item) => {
    const itemSlug = this.itemSlug(item);
    const username = this.getUsername();
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/`;
    console.log(itemSlug);
    const { type } = this.props;
    switch (type) {
      case 'career-goals':
        return `${baseRoute}explorer/career-goals/${itemSlug}`;
      case 'courses':
        return `${baseRoute}explorer/courses/${itemSlug}`;
      case 'degrees':
        return `${baseRoute}explorer/degrees/${itemSlug}`;
      case 'interests':
        return `${baseRoute}explorer/interests/${itemSlug}`;
      case 'opportunities':
        return `${baseRoute}explorer/opportunities/${itemSlug}`;
      default:
        break;
    }
    return '#';
  };

  private studentsParticipating = (item) => {
    let participation = [];
    const interestID = item._id;
    const students = StudentProfiles.findNonRetired();
    _.map(students, (num) => {
      _.filter(num.interestIDs, (interests) => {
        if (interests == interestID) {
          participation.push(num);
          console.log(num.username);
        }
      })
    });
    return participation.length;
  };

  private getInterestDoc = () => {
    const { item } = this.props;
    return item;
  };

  private addInterest = () => {
    const user = Users.getProfile(this.props.match.params.username);
    const interestIDsOfUser = user.interestIDs;
    const interestID = this.getInterestDoc()._id;
    const currentInterestID = [interestID];
    let dataValue;
    let updateValue;
    dataValue = [interestIDsOfUser, currentInterestID];
    updateValue = _.flatten(dataValue);
    console.log(updateValue);
    return updateValue;
  };

  private getRoleByUrl = (): string => {
    const role = this.props.match.url.split('/')[1];
    return role;
  };

  private getCollectionName = () => {
    switch (this.getRoleByUrl()) {
      case 'student':
        return StudentProfiles.getCollectionName();
      case 'faculty':
        return FacultyProfiles.getCollectionName();
      case 'alumni':
        return StudentProfiles.getCollectionName();
      case 'mentor':
        return MentorProfiles.getCollectionName();
    }
  };


  private handleClick = () => {
    console.log('handle click');
    console.log('find doc', Users.getProfile(this.props.match.params.username));
    const newInterestsAfterAdd = this.addInterest();
    console.log('handle click add', newInterestsAfterAdd);
    const updateDataAdd: any = {
      id: Users.getProfile(this.props.match.params.username)._id,
      interests: newInterestsAfterAdd
    };
    console.log('this is the updateData', updateDataAdd);
    const collectionNameAdd = this.getCollectionName();
    console.log('this is the collection name: ', collectionNameAdd);
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
    const { item } = this.props;
    const itemName = this.itemName(item);
    const itemShortDescription = this.itemShortDescription(item);
    const itemParticipation = this.studentsParticipating(item);
    //console.log(item);
    return (
      <Card className='radgrad-interest-card'>
        <Card.Content>
          <Card.Header>{itemName}</Card.Header>
        </Card.Content>
        <Card.Content>
          <Markdown escapeHtml={true} source={`${itemShortDescription}...`}
                    renderers={{ link: this.routerLink }}/>
        </Card.Content>
        <Card.Content>
          STUDENTS PARTICIPATING &middot; {itemParticipation}
        </Card.Content>

        <div className="radgrad-home-buttons ui center aligned two bottom attached buttons">
          <Link to={this.buildRouteName(this.props.item)} class='ui button'>
            <Icon name='chevron circle right'></Icon>
            <br/>
            View More
          </Link>

          <Button className="radgrad-home-buttons center aligned" attatched="bottom" onClick={this.handleClick} fluid><Icon
            name="plus"></Icon>
            <br/>Add to
            Interests</Button>
        </div>


      </Card>

    );

  }
}


export default withRouter(ProfileCard);
