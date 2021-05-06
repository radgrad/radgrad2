import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { Link, useRouteMatch } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';
import { getFutureEnrollmentSingleMethod } from '../../../../../api/utilities/FutureEnrollment.methods';
import { ENROLLMENT_TYPE, EnrollmentForecast } from '../../../../../startup/both/RadGradForecasts';

import { TermCard } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import IceHeader from '../../IceHeader';
import InterestList from '../../InterestList';
import { docToShortDescription, itemToSlugName, opportunityTerms } from '../../utilities/data-model';
import { replaceTermStringNextFour } from '../../utilities/general';
import * as Router from '../../utilities/router';
import FutureParticipation from '../FutureParticipation';

const isType = (typeToCheck: string, type: string) => type === typeToCheck;

const itemName = (item, type: string) => {
  if (isType(EXPLORER_TYPE.COURSES, type)) {
    return `${item.name} (${item.num})`;
  }
  return item.name;
};

const itemTerms = (item, type) => {
  let ret = [];
  if (isType(EXPLORER_TYPE.COURSES, type)) {
    // do nothing
  } else {
    ret = opportunityTerms(item);
  }
  return ret;
};

const buildRouteName = (item, type, match) => {
  const itemSlug = itemToSlugName(item);
  let route: string;
  switch (type) {
    case EXPLORER_TYPE.COURSES:
      route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemSlug}`);
      break;
    case EXPLORER_TYPE.OPPORTUNITIES:
      route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemSlug}`);
      break;
    default:
      route = '#';
      break;
  }
  return route;
};

// TODO Why is this named this?
// TODO Redesign the Cards.

const TermCard: React.FC<TermCard> = ({ item, type }) => {
  const match = useRouteMatch();
  const name = itemName(item, type);
  const isTypeOpportunity = isType('opportunities', type);
  const itemShortDescription = docToShortDescription(item);
  const [data, setData] = useState<EnrollmentForecast>({});
  const [fetched, setFetched] = useState(false);
  let itemType: ENROLLMENT_TYPE;
  if (isType(type, EXPLORER_TYPE.COURSES)) {
    itemType = ENROLLMENT_TYPE.COURSE;
  } else {
    itemType = ENROLLMENT_TYPE.OPPORTUNITY;
  }

  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentSingleMethod.callPromise({ id: item._id, type: itemType })
        .then((result) => setData(result))
        .catch((error) => {
          console.error(error);
          setData({});
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched, item._id, itemType]);
  let academicTerms = [];
  let scores = [];
  if (data?.enrollment) {
    academicTerms = data.enrollment.map((entry) => AcademicTerms.findDoc(entry.termID));
    scores = data.enrollment.map((entry) => entry.count);
  }
  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {name}
          {isTypeOpportunity ? <IceHeader ice={item.ice} /> : ''}
        </Card.Header>

        <Card.Meta>{itemTerms ? replaceTermStringNextFour(itemTerms(item, type)) : ''}</Card.Meta>
      </Card.Content>

      <Card.Content>
        <Markdown escapeHtml source={itemShortDescription} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
        <InterestList item={item} size="mini" />
      </Card.Content>

      <Card.Content>
        <FutureParticipation academicTerms={academicTerms} scores={scores} narrow />
      </Card.Content>

      <Link className="ui button" to={buildRouteName(item, type, match)}>
        <Icon name="chevron circle right" />
        <br />
        View More
      </Link>
    </Card>
  );
};

export default TermCard;
