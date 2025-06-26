import React from "react";
import styles from '../css/SportsMenu.module.css'

const sports = [
  { name: 'VÔLEI', icon: '🏐' },
  { name: 'FUTEBOL', icon: '⚽' },
  { name: 'BASQUETE', icon: '🏀' },
  { name: 'HANDEBOL', icon: '🤾' },
  { name: 'BEACH TÊNIS', icon: '🏖️' },
];

export default function SportsMenu() {
  return (
    <div className={styles.sportsmenu}>
      {sports.map((sport, index) => (
        <div key={index} className={styles.menuitem}>
          <span className={styles.icon}>{sport.icon}</span>
          <span className={styles.label}>{sport.name}</span>
        </div>
      ))}
    </div>
  );
}
