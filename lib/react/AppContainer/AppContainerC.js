import { connect } from 'react-redux';

import sharedSelectors from '../store/sharedSelectors';
import AppContainer from './AppContainer';

const mapStateToProps = state => ({
  themeMode: sharedSelectors.getThemeMode(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
