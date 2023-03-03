import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import Setup2FA from './Setup2FA';

const mapStateToProps = state => ({
  isLoading: sharedSelectors.isLoadingAccount(state),
  twoFactorAuthEnabled: sharedSelectors.getAccount(state).twoFactorEnabled,
  twoFactorUri: sharedSelectors.getAccount(state).twoFactorUri,
});

const mapDispatchToProps = {
  onGenerateSecret: sharedActionCreators.generate2FASecretPressed,
  onEnable: sharedActionCreators.enable2FAPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(Setup2FA);
