import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Card, Icon, Popup, Image } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { IPlanCard } from '../../../../../typings/radgrad';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import AcademicPlanStaticViewer from '../AcademicPlanStaticViewer';
import { EXPLORER_TYPE } from '../../../../../startup/client/route-constants';
import * as Router from '../../router-helper-functions';
import {
  docToName,
  docToShortDescription,
  itemToSlugName, profileIDToFullname,
  profileIDToPicture,
  studentsParticipating,
} from '../../data-model-helper-functions';
import { interestedStudents } from '../explorer-helper-functions';

const PlanCard = (props: IPlanCard) => {
  const { type, item } = props;
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
        <Markdown
          escapeHtml
          source={`${itemShortDescription}...`}
          renderers={{ link: (p) => Router.renderLink(p, props.match) }}
        />
        <AcademicPlanStaticViewer plan={item} />
      </Card.Content>

      <Card.Content>
        <span>
          STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents} />
        </span>
        <Image.Group size="mini">
          {interested.map((student) => (
            <Popup
              key={student._id}
              trigger={<Image src={profileIDToPicture(student._id)} circular bordered />}
              content={profileIDToFullname(student._id)}
            />
          ))}
        </Image.Group>
      </Card.Content>

      <Link className="ui button" to={route}>
        <Icon name="chevron circle right" />
        <br />
        View More
      </Link>
    </Card>
  );
};

export default withRouter(PlanCard);
