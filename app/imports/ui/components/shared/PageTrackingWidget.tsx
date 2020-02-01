import * as React from 'react';
import { Grid, Table, Form, Menu, Radio } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

interface IPageTrackingWidgetProps {

}

interface IPageTrackingWidgetState {

}

class PageTrackingWidget extends React.Component<IPageTrackingWidgetProps, IPageTrackingWidgetState> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const tableBodyScrollStyle = {
      maxHeight: '10px',
      overflowY: 'scroll',
    };

    return (
      <React.Fragment>
        <Grid columns={2}>
          <Grid.Column width={11}>
            <Table style={tableBodyScrollStyle}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Interests</Table.HeaderCell>
                  <Table.HeaderCell>Page Views</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Algorithms</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Android</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Angular</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Apache Spark</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Application Development</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Artificial Intelligence</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Assembler</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Amazon Web Services</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Azure</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Bioinformatics</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Biology</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Blockchain</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>C and C++</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Civic Engineering</Table.Cell>
                  <Table.Cell>47</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>

          <Grid.Column width={5}>
            <Menu text vertical fluid>
              <Menu.Item header>SORT BY</Menu.Item>
              <Form>
                <Form.Field>
                  <Radio checked label="Alphabetical Order" />
                </Form.Field>

                <Form.Field>
                  <Radio label="Most Views" />
                </Form.Field>

                <Form.Field>
                  <Radio label="Least Views" />
                </Form.Field>
              </Form>
              <br />
              <Menu.Item header>FILTER BY DATE</Menu.Item>
              <DatePicker />
              <DatePicker />
              <Menu.Item>Past Month</Menu.Item>
              <Menu.Item>By Semester</Menu.Item>
              <Menu.Item>By Academic Year</Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default PageTrackingWidget;
