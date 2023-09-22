import { connect } from 'react-redux';

import GroupUpdate from './GroupUpdate';

const mapStateToProps = (state, { params: { groupId }, groupSelectors }) => {
  return {
    groupId,
    group: groupSelectors.data.getStandaloneItem(state),
    isLoading: groupSelectors.fetchItem.isPending(state),
    isUpdating: groupSelectors.updateItem.isPending(state),
  };
};

const mapDispatchToProps = (dispatch, { groupActions }) => ({
  onFetch: payload => dispatch(groupActions.fetchItemRequested(payload)),
  onUpdate: payload => dispatch(groupActions.updateRequested(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupUpdate);
