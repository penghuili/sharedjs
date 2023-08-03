import { connect } from 'react-redux';

import sharedSelectors from '../store/sharedSelectors';
import TextEditor from './TextEditor';

const mapStateToProps = state => ({
  themeMode: sharedSelectors.getThemeMode(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
