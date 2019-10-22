import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Card, Button, Icon, Popup, Image } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { IAcademicPlan, IPlanCard } from '../../../typings/radgrad'; // eslint-disable-line
import WidgetHeaderNumber from './WidgetHeaderNumber';
import ProfileAdd from './ProfileAdd';
import AcademicPlanStaticViewer from './AcademicPlanStaticViewer';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from './RouterHelperFunctions';
import {
  docToName,
  docToShortDescription,
  itemToSlugName, profileIDToFullname,
  profileIDToPicture,
  studentsParticipating,
} from './data-model-helper-functions';
import { interestedStudents } from './explorer-helper-functions';

const PlanCard = (props: IPlanCard) => {
  const { type, canAdd, item } = props;
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const numberStudents = studentsParticipating(item);
  const itemSlug = itemToSlugName(item);
  const interested = interestedStudents(item, type);
  const route = Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${itemSlug}`);

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
          {interested.map((student, index) => <Popup
            key={index}
            trigger={<Image src={profileIDToPicture(student)} circular={true} bordered={true}/>}
            content={profileIDToFullname(student)}
          />)}
        </Image.Group>
      </Card.Content>

      <Button.Group className="radgrad-home-buttons center aligned" attached="bottom" widths={2}>
        <Link className="ui button" to={route}>
          <Icon name="chevron circle right"/><br/>View More
        </Link>

        {canAdd ? <ProfileAdd item={item} type={type}/> : ''}
      </Button.Group>
    </Card>
  );
};

export default withRouter(PlanCard);
