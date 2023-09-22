import { connect } from 'react-redux';

import GroupAdd from './GroupAdd';

const mapStateToProps = (state, { groupSelectors }) => ({
  isCreating: groupSelectors.createItem.isPending(state),
});

const mapDispatchToProps = (dispatch, { groupActions }) => ({
  onCreate: payload => dispatch(groupActions.createRequested(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupAdd);
