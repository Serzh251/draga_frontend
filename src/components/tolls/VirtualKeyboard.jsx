import '../../static/css/tools/VirtualKeyboard.css';
import React, { useState } from 'react';

// Английская и русская раскладки
const layouts = {
  en: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', 'Backspace'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.'],
    ['Space'],
  ],
  ru: [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', 'Backspace'],
    ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х'],
    ['CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
    ['Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.'],
    ['Space'],
  ],
};

const VirtualKeyboard = ({ onKeyPress, onClose }) => {
  const [shift, setShift] = useState(false);
  const [caps, setCaps] = useState(false);
  const [lang, setLang] = useState('en'); // Текущая раскладка

  // Переключение раскладки
  const toggleLang = () => {
    setLang((currentLang) => (currentLang === 'en' ? 'ru' : 'en'));
  };

  // Получение символа с учетом регистра и раскладки
  const getKey = (key) => {
    if (key.length === 1) {
      const upperCase = (shift && !caps) || (!shift && caps);
      const layoutKey = layouts[lang].flat().includes(key) ? key : key;
      return upperCase ? layoutKey.toUpperCase() : layoutKey;
    }
    return key;
  };

  // Обработка нажатия кнопки
  const handleClick = (key) => {
    if (key === 'Shift') {
      setShift((s) => !s); // Переключаем Shift
      return;
    }

    if (key === 'CapsLock') {
      setCaps((c) => !c); // Переключаем CapsLock
      return;
    }

    if (key === 'Backspace') {
      onKeyPress('Backspace'); // Передаем Backspace
      return;
    }

    if (key === 'Space') {
      onKeyPress('Space'); // Передаем пробел
      return;
    }

    if (key === 'Lang') {
      toggleLang(); // Переключаем раскладку
      return;
    }

    const char = getKey(key); // Получаем символ с учетом регистра
    onKeyPress(char, (shift && !caps) || (!shift && caps)); // Передаем символ и флаг верхнего регистра
  };

  return (
    <div className="vk-wrapper">
      <div className="vk-header">
        <span>Клавиатура</span>
        <button onClick={onClose} className="vk-close">
          ✕
        </button>
      </div>
      {layouts[lang].map((row, i) => (
        <div key={i} className="vk-row">
          {row.map((key) => (
            <button
              key={key}
              className={`vk-key ${key === 'Shift' || key === 'CapsLock' ? 'vk-modifier' : ''}`}
              onClick={() => handleClick(key)}
            >
              {getKey(key)}
            </button>
          ))}
          {i === layouts[lang].length - 1 && (
            <button className="vk-key vk-modifier" onClick={() => handleClick('Lang')}>
              {lang === 'en' ? 'Ru' : 'En'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
