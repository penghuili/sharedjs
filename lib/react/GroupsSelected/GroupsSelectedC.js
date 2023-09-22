import { connect } from 'react-redux';

import GroupsSelected from './GroupsSelected';

const mapStateToProps = (state, { groupSelectors }) => {
  return {
    groupsObj: groupSelectors.data.getGroupsObj(state),
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsSelected);
