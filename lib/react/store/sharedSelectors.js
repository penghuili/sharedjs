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
    createdAt: state.shared.createdAt,
  }),
  isLoadingAccount: state => state.shared.isLoadingAccount,
  getBotPublicKey: state => state.shared.botPublicKey,
};

export default sharedSelectors;
