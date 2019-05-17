import * as React from 'React';
import { Segment, Container, Header, Card } from 'semantic-ui-react';

interface IStudentTeaserWidget {
}

class StudentTeaserWidget extends React.Component<IStudentTeaserWidget> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const teasers = [];
    return (
        <div>
          <Container>
            <Segment padded={true}>
              <Header dividing={true}>
                <Header as="h4"> TODO: WidgetHeaderNumber </Header>
              </Header>
            </Segment>
          </Container>

          {
            teasers ?
                <Card>
                  {
                    teasers.map((teaser, index) => (

                    )); 
                  }
                </Card>
                :
                <p>Add interests to see recommendations here.</p>
          }
        </div>
    );
  }
}
