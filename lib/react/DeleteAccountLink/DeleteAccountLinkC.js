import { connect } from 'react-redux';
import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import DeleteAccountLink from './DeleteAccountLink';

const mapStateToProps = state => ({
  isLoading: sharedSelectors.isLoadingAuth(state),
  isDeletingAccount: sharedSelectors.isDeletingAccount(state),
});

const mapDispatchToProps = {
  onDelete: sharedActionCreators.deleteAccountPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountLink);
