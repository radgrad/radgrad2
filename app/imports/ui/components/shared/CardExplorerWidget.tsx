import * as React from 'react';

interface ICardExplorerWidgetProps {
  collection: any;
  type: string;
}

class CardExplorerWidget extends React.Component<ICardExplorerWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <React.Fragment>


        {/* TODO: Back To Top Button. I'm not sure if we should put this in the Widget level or the Page level. It is currently
       on the widget level on the original radgrad but it doesn't even appear properly. It seems to only appear if you have
       Google Chrome DevTools window active. - Gian */}
      </React.Fragment>
    );
  }
}

export default CardExplorerWidget;
