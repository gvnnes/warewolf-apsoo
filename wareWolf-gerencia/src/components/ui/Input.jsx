import React from 'react';
import styles from './Input.module.css';

function Input({ type = 'text', name, value, onChange, placeholder, required = false }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={styles.input}
    />
  );
}

export default Input;