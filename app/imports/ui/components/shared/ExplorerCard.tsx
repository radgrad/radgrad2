import * as React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { Link, withRouter } from 'react-router-dom';
import { Slugs } from '../../../api/slug/SlugCollection';
import { IExplorerCard } from '../../../typings/radgrad'; // eslint-disable-line
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from './RouterHelperFunctions';

class ExplorerCard extends React.Component<IExplorerCard> {
  constructor(props) {
    super(props);
  }

  private itemName = (item) => item.name;

  private itemSlug = (item) => Slugs.findDoc(item.slugID).name;

  private itemShortDescription = (item) => {
    let description = item.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
      if (description.charAt(description.length - 1) === ' ') {
        description = `${description.substring(0, 199)}`;
      }
    }
    return description;
  }

  /*
  Because we are using react-router, the converted markdown hyperlinks won't be redirected properly. This is a solution.
  See https://github.com/rexxars/react-markdown/issues/29#issuecomment-231556543
  */
  private routerLink = (props) => (
    props.href.match(/^(https?:)?\/\//)
      ? <a href={props.href}>{props.children}</a>
      : <Link to={props.href}>{props.children}</Link>
  )

  private getUsername = () => this.props.match.params.username;

  private buildRouteName = (item) => {
    const itemSlug = this.itemSlug(item);
    const { type } = this.props;
    let route = '';
    switch (type) {
      case EXPLORER_TYPE.CAREERGOALS:
        route = Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${itemSlug}`);
        break;
      case EXPLORER_TYPE.COURSES:
        route = Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemSlug}`);
        break;
      case EXPLORER_TYPE.DEGREES:
        route = Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}/${itemSlug}`);
        break;
      case EXPLORER_TYPE.INTERESTS:
        route = Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${itemSlug}`);
        break;
      case EXPLORER_TYPE.OPPORTUNITIES:
        route = Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemSlug}`);
        break;
      default:
        route = '#';
        break;
    }
    return route;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { item } = this.props;
    const itemName = this.itemName(item);
    const itemShortDescription = this.itemShortDescription(item);

    return (
      <Card className="radgrad-interest-card">
        <Card.Content>
          <Card.Header>{itemName}</Card.Header>
          <Card.Meta/>
        </Card.Content>

        <Card.Content>
          <Markdown escapeHtml={true} source={`${itemShortDescription}...`}
                    renderers={{ link: this.routerLink }}/>
        </Card.Content>

        <Link to={this.buildRouteName(this.props.item)}>
          <Button className="radgrad-home-buttons center aligned" attached="bottom"><Icon
            name="chevron circle right"/><br/>View More</Button>
        </Link>
      </Card>
    );
  }
}

export default withRouter(ExplorerCard);
