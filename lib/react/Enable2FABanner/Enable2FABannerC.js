import { connect } from 'react-redux';
import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import Enable2FABanner from './Enable2FABanner';

const mapStateToProps = state => {
  return {
    isLoading: sharedSelectors.isLoadingAccount(state),
    isLoggedIn: sharedSelectors.isLoggedIn(state),
    account: sharedSelectors.getAccount(state),
  };
};

const mapDispatchToProps = {
  onSkip: sharedActionCreators.skip2FAPressed,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Enable2FABanner);
