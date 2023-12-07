import React from 'react';

/**
 * A simple React component that represents a font size slider.
 * @component
 *
 * @example
 * // Usage:
 * <FontSizeSlider onFontSizeChange={(fontSize) => handleFontSizeChange(fontSize)} />
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onFontSizeChange - A callback function to handle font size changes.
 * @returns {JSX.Element} React component
 */
interface FontSizeSliderProps {
  onFontSizeChange: (fontSize: number) => void;
}

/**
 * A slider component for adjusting font size.
 * @component
 *
 * @example
 * // Usage:
 * <FontSizeSlider onFontSizeChange={(fontSize) => handleFontSizeChange(fontSize)} />
 *
 * @param {FontSizeSliderProps} props - The component props.
 * @param {Function} props.onFontSizeChange - A callback function to handle font size changes.
 * @returns {JSX.Element} React component
 */
const FontSizeSlider: React.FC<FontSizeSliderProps> = ({ onFontSizeChange }) => {
  /**
   * Handles the change event of the font size slider.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   * @returns {void}
   */
  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSize = Number(event.target.value);
    onFontSizeChange(newFontSize);
  };

  return (
    <div>
      <label
        htmlFor="fontSizeSlider"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          margin: '-1px',
          padding: '0',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          border: '0',
        }}
      >
        Font Size:
      </label>
      <input
        id="fontSizeSlider"
        type="range"
        min="15"
        max="30"
        defaultValue="20"
        onChange={handleFontSizeChange}
      />
    </div>
  );
};

export default FontSizeSlider;
