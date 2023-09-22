import { connect } from 'react-redux';

import GroupsReorder from './GroupsReorder';

const mapStateToProps = (state, { groupSelectors }) => {
  return {
    isLoading: groupSelectors.fetchItems.isPending(state),
    groups: groupSelectors.data.getItems(state),
    isUpdating: groupSelectors.updateItem.isPending(state),
  };
};

const mapDispatchToProps = (dispatch, { groupActions }) => ({
  onFetch: payload => dispatch(groupActions.fetchItemsRequested(payload)),
  onUpdate: payload => dispatch(groupActions.updateRequested(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsReorder);
