import { connect } from 'react-redux';
import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import GroupFilter from './GroupFilter';

const mapStateToProps = (state, { groupSelectors }) => {
  return {
    groups: groupSelectors.data.getItems(state),
    groupsObj: groupSelectors.data.getGroupsObj(state),
    primaryGroups: groupSelectors.data.getPrimaryItems(state),
    secondaryGroups: groupSelectors.data.getSecondaryItems(state),
    noGroupItem: groupSelectors.data.getNoGroupItem(state),
    isExpired: !sharedSelectors.isAccountValid(state),
  };
};

const mapDispatchToProps = {
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupFilter);
