import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import SignIn from './SignIn';

const mapStateToProps = state => ({
  errorMessage: sharedSelectors.getErrorMessage(state),
  isLoading: sharedSelectors.isLoadingAuth(state),
});

const mapDispatchToProps = {
  onClearError: () => sharedActionCreators.setAuthError(null),
  onSignIn: sharedActionCreators.signInPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
