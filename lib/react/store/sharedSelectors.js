import { formatDate } from '../../js/date';

const sharedSelectors = {
  getThemeMode: state => state.shared.themeMode,
  getToast: state => state.shared.toast,

  isCheckingRefreshToken: state => state.shared.isCheckingRefreshToken,
  isLoggedIn: state => state.shared.isLoggedIn,
  isLoadingAuth: state => state.shared.isLoadingAuth,
  getErrorMessage: state => state.shared.errorMessage,

  getAccount: state => ({
    userId: state.shared.userId,
    username: state.shared.username,
    twoFactorChecked: state.shared.twoFactorChecked,
    twoFactorEnabled: state.shared.twoFactorEnabled,
    twoFactorUri: state.shared.twoFactorUri,
    createdAt: state.shared.createdAt,
  }),
  isLoadingAccount: state => state.shared.isLoadingAccount,
  getBotPublicKey: state => state.shared.botPublicKey,
  isDeletingAccount: state => state.shared.isDeletingAccount,

  getSettings: state => state.shared.settings,
  isLoadingSettings: state => state.shared.isLoadingSettings,
  isTrying: state => state.shared.isTrying,
  tried: state => state.shared?.settings?.tried,
  getExpiresAt: state => state.shared?.settings?.expiresAt,
  isAccountValid: state => {
    const expiresAt = sharedSelectors.getExpiresAt(state);
    const today = formatDate(new Date());
    return !!expiresAt && expiresAt >= today;
  },
};

export default sharedSelectors;
