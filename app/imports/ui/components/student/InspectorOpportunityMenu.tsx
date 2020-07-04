import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import IceHeader from '../shared/IceHeader';
import { degreePlannerActions } from '../../../redux/student/degree-planner';

interface IInpectorOpportunityMenuProps {
  studentID: string;
  selectOpportunity: (courseID: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  selectOpportunity: (courseID) => dispatch(degreePlannerActions.selectOpportunity(courseID)),
});

function opportunityStructureForMenu() {
  const opportunities = Opportunities.find({}, { sort: { name: 1 } }).fetch();
  // console.log(opportunities.length);
  const opportunityStructure = [];
  while (opportunities.length > 0) {
    const subarray = [];
    for (let i = 0; i < 10; i++) {
      if (opportunities.length > 0) {
        subarray.push(opportunities.shift());
      }
    }
    opportunityStructure.push(subarray);
  }
  // console.log(opportunityStructure);
  return opportunityStructure;
}

function shortenName(name: string) {
  if (name.length > 7) {
    return `${name.substr(0, 4)}...`;
  }
  return name;
}

function opportunitiesLabel(opportunities) {
  return `${shortenName(opportunities[0].name)} - ${shortenName(opportunities[opportunities.length - 1].name)}`;
}

const InspectorOpportunityMenu = (props: IInpectorOpportunityMenuProps) => {
  // console.log('InspectorOpportunityMenu', props);

  const handleClick = (event, { value }) => {
    event.preventDefault();
    props.selectOpportunity(value);
  };

  const opportunityMenuStructure = opportunityStructureForMenu();
  return (
    <Dropdown text="Opportunities">
      <Dropdown.Menu>
        {_.map(opportunityMenuStructure, (opportunities, index) => (
          <Dropdown.Item key={index}>
            <Dropdown text={opportunitiesLabel(opportunities)}>
              <Dropdown.Menu direction="left">
                {_.map(opportunities, (o) => (
                  <Dropdown.Item key={o._id} value={o._id} onClick={handleClick}>
                    {o.name}
                    {' '}
                    <IceHeader
                      ice={o.ice}
                    />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const InspectorOpportunityMenuContainer = connect(null, mapDispatchToProps)(InspectorOpportunityMenu);
export default InspectorOpportunityMenuContainer;
