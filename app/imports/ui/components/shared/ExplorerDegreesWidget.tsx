import * as React from 'react';
import { Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { renderLink } from './RouterHelperFunctions';

interface IExplorerDegreesWidgetProps {
  name: string;
  descriptionPairs: any;
}

class ExplorerDegreesWidget extends React.Component<IExplorerDegreesWidgetProps> {
  constructor(props) {
    super(props);
  }

  private toUpper = (string) => string.toUpperCase();

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const segmentGroupStyle = { backgroundColor: 'white' };
    const segmentClearingBasicStyle = {
      margin: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    };
    const dividerStyle = { marginTop: 0 };

    const { name, descriptionPairs } = this.props;

    return (
      <Segment.Group style={segmentGroupStyle}>
        <Container>
          <Segment padded={true}>
            <Segment clearing={true} basic={true} style={segmentClearingBasicStyle}>
              <Header floated="left" as="h4">{this.toUpper(name)}</Header>
            </Segment>

            <Divider style={dividerStyle}/>

            <Grid stackable={true}>
              <Grid.Column>
                {
                  descriptionPairs.map((descriptionPair, index) => (
                    descriptionPair.value ?
                      <React.Fragment key={index}>
                        <b>{descriptionPair.label}:</b>
                        <Markdown escapeHtml={false} source={descriptionPair.value}
                                  renderers={{ link: renderLink }}/>
                      </React.Fragment>
                      :
                      <p key={index}><b>{descriptionPair.label}:</b> N/A</p>
                  ))
                }
              </Grid.Column>
            </Grid>
          </Segment>
        </Container>
      </Segment.Group>
    );
  }
}

export default ExplorerDegreesWidget;
