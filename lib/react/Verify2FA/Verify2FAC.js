import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import Verify2FA from './Verify2FA';

const mapStateToProps = state => ({
  errorMessage: sharedSelectors.getErrorMessage(state),
  isLoading: sharedSelectors.isLoadingAuth(state),
});

const mapDispatchToProps = {
  onClearError: () => sharedActionCreators.setAuthError(null),
  onVerify: sharedActionCreators.verify2FAPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify2FA);
