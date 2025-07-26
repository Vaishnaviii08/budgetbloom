import React from 'react';

const emojis = {
  happy: "😊",
  sad: "😢",
  stressed: "😰",
  neutral: "😐",
  guilty: "😔",
  excited: "😄",
};

const EmotionPicker = ({ selectedEmotion, onSelect }) => {
  const handleClick = (e, emotion) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(emotion);
  };

  const containerStyle = {
    display: 'flex',
    gap: '12px',
    border: 'none',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  const baseButtonStyle = {
    width: '40px',
    height: '40px',
    fontSize: '20px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const selectedStyle = {
    backgroundColor: '#d0eaff',
    borderColor: '#3399ff',
  };

  return (
    <div style={containerStyle}>
      {Object.entries(emojis).map(([emotion, emoji]) => (
        <button
          key={emotion}
          title={emotion}
          onClick={(e) => handleClick(e, emotion)}
          style={{
            ...baseButtonStyle,
            ...(selectedEmotion === emotion ? selectedStyle : {}),
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmotionPicker;
