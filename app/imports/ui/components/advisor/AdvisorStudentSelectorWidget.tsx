import * as React from 'react';
import { Segment, Header, Tab, Grid } from 'semantic-ui-react';

class AdvisorStudentSelectorWidget extends React.Component {
    public render() {
        const panes = [
            {
                menuItem: 'Update Existing',
                render: () =>
                    <Tab.Pane key={'update'}>
                        <Grid>
                            <Header as="h4" dividing={true}>FILTER STUDENTS</Header>

                        </Grid>
                    </Tab.Pane>
                ,
            },
            {
                menuItem: 'Add New',
                render: () =>
                    <Tab.Pane key={'new'}>
                        <Header content={'ADD NEW'}/>
                    </Tab.Pane>
                ,
            },
            {
                menuItem: 'Bulk STAR Upload',
                render: () =>
                    <Tab.Pane key={'upload'}>
                        <Header content={'BULK STAR UPL'}/>
                    </Tab.Pane>
                ,
            },
        ];

        return (
            <Segment>
                <Header as="h4" dividing={true}>SELECT STUDENT</Header>
                <Tab panes={panes}/>
            </Segment>
        );
    }
}

export default AdvisorStudentSelectorWidget;