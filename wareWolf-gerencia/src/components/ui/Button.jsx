import React from 'react';
import styles from './Button.module.css';

function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false }) {

  const buttonClass = `${styles.button} ${styles[variant]}`;

  return (
    <button className={buttonClass} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;