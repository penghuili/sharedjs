import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import ChangeTheme from './ChangeTheme';

const mapStateToProps = state => ({
  themeMode: sharedSelectors.getThemeMode(state),
});

const mapDispatchToProps = {
  onChangeTheme: sharedActionCreators.changeThemeModePressed,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeTheme);
