import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import PaymentStatus from './PaymentStatus';

const mapStateToProps = state => ({
  settings: sharedSelectors.getSettings(state),
  expiresAt: sharedSelectors.getExpiresAt(state),
  tried: sharedSelectors.tried(state),
  isTrying: sharedSelectors.isTrying(state),
});

const mapDispatchToProps = {
  onTry: sharedActionCreators.tryPressed,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentStatus);
