import { connect } from 'react-redux';

import GroupsSelector from './GroupsSelector';

const mapStateToProps = (state, { groupSelectors }) => {
  return {
    groups: groupSelectors.data.getItems(state),
    getIsAddingGroupItem: groupId => groupSelectors.createGroupItem.isPending(state, groupId),
    getIsDeletingGroupItem: groupId => groupSelectors.deleteGroupItem.isPending(state, groupId),
  };
};

const mapDispatchToProps = (dispatch, { groupActions }) => ({
  onFetchGroups: payload => dispatch(groupActions.fetchItemsRequested(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsSelector);
