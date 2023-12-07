/**
 * Sets the font size for the root HTML element and applies it to all elements on the page.
 *
 * @function
 * @param {number} fontSize - The new font size in pixels.
 * @returns {void}
 */
const setFontSize = (fontSize: number) => {
  document.documentElement.style.transition = 'font-size 0.5s';
  document.documentElement.style.fontSize = `${fontSize}px`;

  const allElements = document.querySelectorAll('*');
  allElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.fontSize = `${fontSize}px`;
  });
};

export default setFontSize;
