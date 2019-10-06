import * as React from 'react';
import { Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { renderLink } from './RouterHelperFunctions';
import { toUpper } from './helper-functions';

interface IExplorerDegreesWidgetProps {
  name: string;
  descriptionPairs: any;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class ExplorerDegreesWidget extends React.Component<IExplorerDegreesWidgetProps> {
  constructor(props) {
    super(props);
  }

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

    const { name, descriptionPairs, match } = this.props;

    return (
      <Segment.Group style={segmentGroupStyle}>
        <Container>
          <Segment padded={true}>
            <Segment clearing={true} basic={true} style={segmentClearingBasicStyle}>
              <Header floated="left" as="h4">{toUpper(name)}</Header>
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
                                  renderers={{ link: (props) => renderLink(props, match) }}/>
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

export default withRouter(ExplorerDegreesWidget);
