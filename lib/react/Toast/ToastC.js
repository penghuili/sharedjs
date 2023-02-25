import { connect } from 'react-redux';

import { sharedActionCreators } from '../store/sharedActions';
import sharedSelectors from '../store/sharedSelectors';
import Toast from './Toast';

const mapStateToProps = state => ({
  toast: sharedSelectors.getToast(state),
});

const mapDispatchToProps = {
  onClose: () => sharedActionCreators.setToast(''),
};

export default connect(mapStateToProps, mapDispatchToProps)(Toast);
