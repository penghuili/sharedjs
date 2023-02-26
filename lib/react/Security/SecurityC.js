import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import Security from './Security';

const mapStateToProps = (state) => ({
  isLoading: sharedSelectors.isLoadingAuth(state),
});

const mapDispatchToProps = {
  onLogOut: sharedActionCreators.logOutPressed,
  onLogOutFromAllDevices: sharedActionCreators.logOutFromAllDevicesPressed,
  onDelete: sharedActionCreators.deleteAccountPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(Security);
