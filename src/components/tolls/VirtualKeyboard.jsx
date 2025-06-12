import '../../static/css/tools/VirtualKeyboard.css';
import React, { useState } from 'react';

const layout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.'],
  ['Space'],
];

const VirtualKeyboard = ({ onKeyPress, onClose }) => {
  const [shift, setShift] = useState(false);
  const [caps, setCaps] = useState(false);

  const getKey = (key) => {
    const upperCase = (shift && !caps) || (!shift && caps);
    return key.length === 1 ? (upperCase ? key.toUpperCase() : key) : key;
  };

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
      {layout.map((row, i) => (
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
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
