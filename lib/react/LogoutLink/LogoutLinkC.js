import { connect } from 'react-redux';
import { sharedActionCreators } from '../store/sharedActions';
import LogoutLink from './LogoutLink';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onLogOut: sharedActionCreators.logOutPressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogoutLink);
