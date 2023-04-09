import { connect } from 'react-redux';

import AppContainer from '../../react-pure/AppContainer';
import sharedSelectors from '../store/sharedSelectors';

const mapStateToProps = state => ({
  themeMode: sharedSelectors.getThemeMode(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
