import React from 'react';
import { Grid, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import { PlanChoices } from '../../../../api/degree-plan/PlanChoiceCollection';
import { buildSimpleName, complexChoiceToArray, stripCounter } from '../../../../api/degree-plan/PlanChoiceUtilities';
import { getNotSatisfiedStyle, getSatisfiedStyle } from './utilities/styles';

interface SatisfiedPlanChoicePillProps {
  choice: string;
  satisfied: boolean;
}

const SatisfiedPlanChoicePill: React.FC<SatisfiedPlanChoicePillProps> = ({ choice, satisfied }) => {
  const style = satisfied ? getSatisfiedStyle() : getNotSatisfiedStyle();
  const stripped = stripCounter(choice);
  const courseSlugs = complexChoiceToArray(stripped);
  const courseNames = _.map(courseSlugs, (slug) => buildSimpleName(slug));
  const popupContents = `Choose one: ${courseNames.join(' or ')}. Favorite one or more in the Course explorer.`;
  return (
    <Grid.Row style={style}>
      <Popup
        trigger={<div><b>{PlanChoices.toString(stripped)}</b></div>}
        // trigger={<Label>{props.groups[stripped].name}</Label>}
        content={popupContents}
      />
    </Grid.Row>
  );
};

export default SatisfiedPlanChoicePill;
