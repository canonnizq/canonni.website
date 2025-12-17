import { useEffect, useState } from 'react';
import styles from '../styles/Typewriter.module.css';

export default function Typewriter() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  const typingSpeed = 100;
  const [displayedText, setDisplayedText] = useState('');
  const fullTexts = [
    'CanonNi',
    'canonnizq',
    'Ni Zeqing',
    '倪泽青',
    'CNZQ',
    'Pongo sapiens',
    'Kinney',
    'BI4APQ',
  ];

  const shuffle = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    let letter_idx = 0;
    let currentText = '';
    let order = shuffle([...fullTexts]);
    let timeoutId: number;

    const type = () => {
      if (letter_idx == 0) {
        currentText = order.pop()!;
        if (order.length == 0) {
          order = shuffle([...fullTexts]);
        }
        setDisplayedText('');
      }

      if (letter_idx < currentText.length) {
        setDisplayedText((prev) => prev + currentText[letter_idx - 1]);
        letter_idx++;
        timeoutId = setTimeout(type, typingSpeed);
      } else {
        letter_idx = 0;
        timeoutId = setTimeout(type, typingSpeed * 10);
      }
    };

    type();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={styles.container}>
      <span className={`${styles.text} monospace`}>
        {isMobile ? 'CanonNi' : displayedText}
        {isMobile ? null : <span className={styles.cursor}>|</span>}
      </span>
      <div className={styles.domain}>
        <span className={styles.tooltip}>Yup, that's an actual TLD.</span>
        <span className={styles.middle}>
          <span className={styles.tld}>.website</span>
          <span className={styles.links}>
            <a target="_blank" href="https://github.com/canonnizq/canonni.website">
              source
            </a>
            &bull;
            <a target="_blank" href="https://afdian.com/a/canonni">
              sponsor
            </a>
          </span>
        </span>
        <span className={styles.tooltip}>Pretty apt for a website, huh?</span>
      </div>
    </div>
  );
}
