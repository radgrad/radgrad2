import * as React from 'react';
import { Accordion, Button } from 'semantic-ui-react';
import * as _ from 'lodash';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { IDescriptionPair, IRadGradMatch } from '../../../typings/radgrad'; // eslint-disable-line
import * as Router from '../shared/RouterHelperFunctions';

interface IAdminCollectionAccordionProps {
  id: string;
  title: React.ReactNode;
  match: IRadGradMatch;
  descriptionPairs: IDescriptionPair[];
  updateDisabled: boolean;
  deleteDisabled: boolean;
  handleOpenUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
}

interface IAdminCollectionAccordionState {
  active: boolean;
}

class AdminCollectionAccordion extends React.Component<IAdminCollectionAccordionProps, IAdminCollectionAccordionState> {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }

  public handleClick = () => {
    let { active } = this.state;
    active = !active;
    this.setState({ active });
  }

  public render(): React.ReactNode {
    const { match } = this.props;
    return (
      <Accordion fluid styled>
        <Accordion.Title active={this.state.active} onClick={this.handleClick}>
          {this.props.title}
        </Accordion.Title>
        <Accordion.Content active={this.state.active}>
          {_.map(this.props.descriptionPairs, (descriptionPair, index) => (
            <React.Fragment key={index}>
              <b>
                {descriptionPair.label}
:
              </b>
              {' '}
              {typeof descriptionPair.value === 'string' ? eslint - disable - line(
                <Markdown
                  escapeHtml
                  source={descriptionPair.value}
                  renderers={{ link: (props) => Router.renderLink(props, match) }}
                />,
            ) : typeof descriptionPair.value === 'undefined' ? ' ' :
            <p>{descriptionPair.value.join(', ')}</p>}
            </React.Fragment>
          ))}
          <p>
            <Button
              id={this.props.id}
              color="green"
              basic
              size="mini"
              disabled={this.props.updateDisabled}
              onClick={this.props.handleOpenUpdate}
            >
Update
            </Button>
            <Button
              id={this.props.id}
              color="green"
              basic
              size="mini"
              disabled={this.props.deleteDisabled}
              onClick={this.props.handleDelete}
            >
Delete
            </Button>
          </p>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default withRouter(AdminCollectionAccordion);
