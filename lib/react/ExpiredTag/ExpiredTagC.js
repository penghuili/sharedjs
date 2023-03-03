import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import ExpiredTag from './ExpiredTag';

const mapStateToProps = state => ({
  isLoggedIn: sharedSelectors.isLoggedIn(state),
  isAccountValid: sharedSelectors.isAccountValid(state),
  expiresAt: sharedSelectors.getExpiresAt(state),
});

const mapDispatchToProps = {
  onBack: sharedActionCreators.goBack,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpiredTag);
