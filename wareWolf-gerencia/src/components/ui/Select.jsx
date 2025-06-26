import React from 'react';
import styles from './Select.module.css';

function Select({ name, value, onChange, children }) {
  return (
    <select name={name} value={value} onChange={onChange} className={styles.select}>
      {children}
    </select>
  );
}

export default Select;