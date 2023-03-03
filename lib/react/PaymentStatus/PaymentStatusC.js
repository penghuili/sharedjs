import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import PaymentStatus from './PaymentStatus';

const mapStateToProps = state => ({
  expiresAt: sharedSelectors.getExpiresAt(state),
  tried: sharedSelectors.tried(state),
  isAccountValid: sharedSelectors.isAccountValid(state),
  isLoading: sharedSelectors.isLoadingSettings(state),
  isTrying: sharedSelectors.isTrying(state),
});

const mapDispatchToProps = {
  onTry: sharedActionCreators.tryPressed,
  onNavigate: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentStatus);
