import { connect } from 'react-redux';

import Groups from './Groups';

const mapStateToProps = (state, { groupSelectors }) => {
  return {
    isLoading: groupSelectors.fetchItems.isPending(state),
    groups: groupSelectors.data.getItems(state),
    isDeleting: groupSelectors.deleteItem.isPending(state),
  };
};

const mapDispatchToProps = (dispatch, { groupActions }) => ({
  onFetch: payload => dispatch(groupActions.fetchItemsRequested(payload)),
  onDelete: payload => dispatch(groupActions.deleteRequested(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
