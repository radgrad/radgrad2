import * as React from 'react';
import { Divider, Grid } from 'semantic-ui-react';
import { IAdvisorAcademicPlanBuilderWidgetState } from './AdvisorAcademicPlanBuilderWidget'; // eslint-disable-line no-unused-vars

interface IAdvisorAPBYearViewProps {
  yearNumber: number;
}

class AdvisorAPBYearView extends React.Component<IAdvisorAPBYearViewProps, IAdvisorAcademicPlanBuilderWidgetState> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const academicYearStyle = {
      padding: '0 0.6rem',
    };
    return (
      <Grid.Column key={this.props.yearNumber} style={academicYearStyle}>
        <Divider horizontal={true}>Year {this.props.yearNumber}</Divider>
      </Grid.Column>
      );
  }
}

export default AdvisorAPBYearView;
