import { connect } from 'react-redux';
import GroupsUpdater from './GroupsUpdater';

const mapStateToProps = (state, { groupSelectors }) => {
  return {
    groups: groupSelectors.data.getItems(state),
    groupsObj: groupSelectors.data.getGroupsObj(state),
    getIsAddingGroupItem: groupId => groupSelectors.createGroupItem.isPending(state, groupId),
    getIsDeletingGroupItem: groupId => groupSelectors.deleteGroupItem.isPending(state, groupId),
  };
};

const mapDispatchToProps = (dispatch, { groupActions }) => ({
  onFetchGroups: payload => dispatch(groupActions.fetchItemsRequested(payload)),
  onAdd: payload => dispatch(groupActions.createGroupItemRequested(payload)),
  onDelete: payload => dispatch(groupActions.deleteGroupItemRequested(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsUpdater);
