import { connect } from 'react-redux';

import Groups from './Groups';
import { sharedActionCreators } from '../store/sharedActions';

const mapStateToProps = (state, { groupSelectors }) => {
  return {
    isLoading: groupSelectors.fetchItems.isPending(state),
    groups: groupSelectors.data.getItems(state),
    isDeleting: groupSelectors.deleteItem.isPending(state),
  };
};

const mapDispatchToProps = (dispatch, { groupActions }) => ({
  onFetch: payload => dispatch(groupActions.fetchItemsRequested(payload)),
  onUpdate: payload => dispatch(groupActions.updateRequested(payload)),
  onDelete: payload => dispatch(groupActions.deleteRequested(payload)),
  onNav: path => dispatch(sharedActionCreators.navigate(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
