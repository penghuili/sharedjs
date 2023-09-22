import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import GroupFilter from './GroupFilter';

const mapStateToProps = (state, { groupSelectors }) => {
  return {
    groups: groupSelectors.data.getItems(state),
    primaryGroups: groupSelectors.data.getPrimaryItems(state),
    secondaryGroups: groupSelectors.data.getSecondaryItems(state),
    noGroupItem: groupSelectors.data.getNoGroupItem(state),
  };
};

const mapDispatchToProps = {
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupFilter);
