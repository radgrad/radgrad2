import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import AdvisorAPBYearView from './AdvisorAPBYearView';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';

interface IAdvisorAPBPlanViewWidgetProps {
  coursesPerTerm: number[];
  choiceList: string[];
}

class AdvisorAPBPlanViewWidget extends React.Component<IAdvisorAPBPlanViewWidgetProps> {
  constructor(props) {
    super(props);
    // console.log('AdvisorAPBPlanViewWidget %o', props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const quarterSystem = RadGradSettings.findOne({}).quarterSystem;
    return (
      <Grid widths='equal' columns={5}>
        <AdvisorAPBYearView yearNumber={1} choiceList={this.props.choiceList} quarterSystem={quarterSystem}
                            coursesPerTerm={this.props.coursesPerTerm}/>
        <AdvisorAPBYearView yearNumber={2} choiceList={this.props.choiceList} quarterSystem={quarterSystem}
                            coursesPerTerm={this.props.coursesPerTerm}/>
        <AdvisorAPBYearView yearNumber={3} choiceList={this.props.choiceList} quarterSystem={quarterSystem}
                            coursesPerTerm={this.props.coursesPerTerm}/>
        <AdvisorAPBYearView yearNumber={4} choiceList={this.props.choiceList} quarterSystem={quarterSystem}
                            coursesPerTerm={this.props.coursesPerTerm}/>
        <AdvisorAPBYearView yearNumber={5} choiceList={this.props.choiceList} quarterSystem={quarterSystem}
                            coursesPerTerm={this.props.coursesPerTerm}/>
      </Grid>
    );
  }
}

export default AdvisorAPBPlanViewWidget;
