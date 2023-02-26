import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import SignUp from './SignUp';

const mapStateToProps = state => ({
  errorMessage: sharedSelectors.getErrorMessage(state),
  isLoading: sharedSelectors.isLoadingAuth(state),
});

const mapDispatchToProps = {
  onClearError: () => sharedActionCreators.setAuthError(null),
  onSignUp: sharedActionCreators.signUpPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
