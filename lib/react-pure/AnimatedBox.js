import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

function AnimatedBox({ visible, children }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1, height: '0px' }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: '0px' }}
          transition={{ duration: 0.2, opacity: { delay: 0.1 } }} // delay opacity transition to start after height starts reducing
          style={{ overflow: 'hidden', width: '100%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AnimatedBox;
