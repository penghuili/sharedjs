import { connect } from 'react-redux';
import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import AppBar from './AppBar';

const mapStateToProps = state => ({
  isLoggedIn: sharedSelectors.isLoggedIn(state),
  isExpired: !sharedSelectors.isAccountValid(state),
});

const mapDispatchToProps = {
  onBack: sharedActionCreators.goBack,
  onNav: sharedActionCreators.navigate,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);
