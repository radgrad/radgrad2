import * as React from 'react';
import { Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as Markdown from 'react-markdown';

interface IExplorerDegreesWidgetProps {
  name: string;
  slug: string;
  descriptionPairs: any;
  socialPairs: object[];
  id: string;
  item: object;
}

class ExplorerDegreesWidget extends React.Component<IExplorerDegreesWidgetProps> {
  constructor(props) {
    super(props);
  }

  private toUpper = (string) => string.toUpperCase();

  /*
  Because we are using react-router, the converted markdown hyperlinks won't be redirected properly. This is a solution.
  See https://github.com/rexxars/react-markdown/issues/29#issuecomment-231556543
  */
  private routerLink = (props) => (
    props.href.match(/^(https?:)?\/\//)
      ? <a href={props.href}>{props.children}</a>
      : <Link to={props.href}>{props.children}</Link>
  )

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const segmentGroupStyle = { backgroundColor: 'white' };
    const segmentClearingBasicStyle = {
      margin: 0,
      padidngLeft: 0,
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
                        <Markdown escapeHtml={false} source={descriptionPair.value}/>
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
