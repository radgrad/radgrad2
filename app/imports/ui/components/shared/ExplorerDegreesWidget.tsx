import React from 'react';
import { Container, Divider, Grid, Header, Segment } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { renderLink } from './RouterHelperFunctions';
import { toUpper } from './helper-functions';
import { explorerDegreeWidget } from './shared-widget-names';
import { toId } from '../../shared/description-pair-helpers';
import { IRadGradMatch } from '../../../typings/radgrad';

interface IExplorerDegreesWidgetProps {
  name: string;
  descriptionPairs: any;
  match: IRadGradMatch;
}

const ExplorerDegreesWidget = (props: IExplorerDegreesWidgetProps) => {
  const segmentGroupStyle = { backgroundColor: 'white' };
  const segmentClearingBasicStyle = {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  };
  const dividerStyle = { marginTop: 0 };

  const { name, descriptionPairs, match } = props;

  return (
    <Segment.Group style={segmentGroupStyle} id={explorerDegreeWidget}>
      <Container>
        <Segment padded>
          <Segment clearing basic style={segmentClearingBasicStyle}>
            <Header floated="left" as="h4">{toUpper(name)}</Header>
          </Segment>

          <Divider style={dividerStyle} />

          <Grid stackable>
            <Grid.Column>
              {
                descriptionPairs.map((descriptionPair) => (
                  descriptionPair.value ? (
                    <React.Fragment key={toId(descriptionPair)}>
                      <b>
                        {descriptionPair.label}
:
                      </b>
                      <Markdown
                        escapeHtml={false}
                        source={descriptionPair.value}
                        renderers={{ link: (localProps) => renderLink(localProps, match) }}
                      />
                    </React.Fragment>
                  )
                    : (
                      <p key={toId(descriptionPair)}>
                        <b>
                          {descriptionPair.label}
:
                        </b>
                        {' '}
N/A
                      </p>
                  )
                ))
              }
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    </Segment.Group>
  );
};

export default withRouter(ExplorerDegreesWidget);
