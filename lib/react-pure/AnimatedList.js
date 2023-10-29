import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

function AnimatedList({ items, keyField = 'sortKey', renderItem, animation = {} }) {
  if (!items?.length) {
    return null;
  }

  return (
    <AnimatePresence>
      {items.map((item, index) => (
        <motion.div
          key={item[keyField]}
          initial={animation.initial || { opacity: 0, scale: 0.5, y: -50 }}
          animate={animation.animate || { opacity: 1, scale: 1, y: 0 }}
          exit={animation.exit || { opacity: 0, scale: 0.9, rotateZ: 10 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            delay: index * 0.02, // staggered delay
          }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export default AnimatedList;
