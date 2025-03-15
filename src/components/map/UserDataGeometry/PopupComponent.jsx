import React from 'react';

const PopupContent = ({ name, description }) => {
  return (
    <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
      <b>{name}</b>
      <hr />
      {description}
    </div>
  );
};

export default PopupContent;
