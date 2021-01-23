import React from 'react';
import { connect } from 'react-redux';
import { Pagination, PaginationProps } from 'semantic-ui-react';
import { cardExplorerActions } from '../../../../../redux/shared/cardExplorer';

interface ExplorerOpportunitiesPaginationWidgetProps {
  type: string;
  totalCount: number;
  displayCount: number;
  setShowIndex: (explorerType: string, index: number) => any;
}

const mapDispatchToProps = (dispatch) => ({
  setShowIndex: (explorerType: string, index: number) => dispatch(cardExplorerActions.setShowIndex(explorerType, index)),
});

const ExplorerOpportunitiesPaginationWidget: React.FC<ExplorerOpportunitiesPaginationWidgetProps> = ({ type, totalCount, displayCount, setShowIndex }) => {
  const totalPages = Math.ceil(totalCount / displayCount);

  const handlePaginationChange = (e, data: PaginationProps) => {
    e.preventDefault();
    // <Pagination> starts at value 1 for the first Pagination
    const index = (data.activePage as number) - 1;
    setShowIndex(type, index);
  };

  return <Pagination secondary totalPages={totalPages} onPageChange={(event, data) => handlePaginationChange(event, data)} />;
};

export default connect(null, mapDispatchToProps)(ExplorerOpportunitiesPaginationWidget);
