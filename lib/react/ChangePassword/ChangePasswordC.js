import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import ChangePassword from './ChangePassword';

const mapStateToProps = state => ({
  isLoading: sharedSelectors.isLoadingAccount(state),
});

const mapDispatchToProps = {
  onChange: sharedActionCreators.changePasswordPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
