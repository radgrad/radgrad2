import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { Card, Button, Icon } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import * as _ from 'lodash';
import { IAcademicPlan, IPlanCard } from '../../../typings/radgrad'; // eslint-disable-line
import WidgetHeaderNumber from './WidgetHeaderNumber';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import ProfileAdd from './ProfileAdd';
import AcademicPlanStaticViewer from './AcademicPlanStaticViewer';

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

  private numberStudents = (item: IAcademicPlan): number => this.interestedStudentsHelper(item, this.props.type).length;

  private interestedStudentsHelper = (item: IAcademicPlan, type: string): object[] => {
    const interested = [];
    let instances = StudentProfiles.find({}).fetch();
    if (type === 'plans') {
      instances = _.filter(instances, (profile) => profile.academicPlanID === item._id);
    }
    _.forEach(instances, (p) => {
      if (!_.includes(interested, p.userID)) {
        interested.push(p.userID);
      }
    });
    return interested;
  }

  private buildRouteName = (slug: string): string => {
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;
    return `${baseRoute}/explorer/plans/${slug}`;
  }

  private itemSlug = (item: IAcademicPlan): string => Slugs.findDoc(item.slugID).name;

  // Note, in the context of PlanCard (/explorer/plans), this function doesn't do anything because the Draggables and
  // Droppables are set to disabled when the user is in the /explorer/plans page. This is just to get rid of the error
  // saying that onDragEnd field for <DragDropContext/> is required.
  private handleDragEnd = () => {
    //  do nothing
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { type, canAdd, item } = this.props;
    const itemName = this.itemName(item);
    const itemShortDescription = this.itemShortDescription(item);
    const numberStudents = this.numberStudents(item);
    const itemSlug = this.itemSlug(item);
    return (
      <Card className="radgrad-interest-card">
        <Card.Content>
          <Card.Header>{itemName}</Card.Header>
        </Card.Content>

        <Card.Content>
          <Markdown escapeHtml={true} source={`${itemShortDescription}...`}/>
          <DragDropContext onDragEnd={this.handleDragEnd}>
            <AcademicPlanStaticViewer plan={item}/>
          </DragDropContext>
        </Card.Content>

        <Card.Content>
          <span>STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents}/></span>
        </Card.Content>

        <Button.Group className="radgrad-home-buttons center aligned" attached="bottom" widths={2}>
          <Link className="ui button" to={this.buildRouteName(itemSlug)}>
            <Icon name="chevron circle right"/><br/>View More
          </Link>

          {canAdd ? <ProfileAdd item={item} type={type}/> : ''}
        </Button.Group>
      </Card>
    );
  }
}

export default withRouter(PlanCard);
