import { useState, useEffect, useRef } from 'react';

// @ts-ignore
import styles from './display.module.css';
import {useNavigate} from 'react-router-dom';
import FontSizeSlider from './FontSizeSlider';
import setFontSize from './fontSizeUtility';

const addOnIDs= [6,7,8,9,10,11,12,13,14,15,16];

/**
 * A simple React component that creates the header for the drink menu page
 * @component
 *
 * @returns {JSX.Element} React component
 */

const Header = () => {
  const hasEffectRun = useRef(false);

  const googleTranslateElementInit = () => {
    // @ts-ignore
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    if (!hasEffectRun.current) {
      console.log('rendered translate once');
      var addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
      // @ts-ignore
      window.googleTranslateElementInit = googleTranslateElementInit;

      hasEffectRun.current = true;
    }
  }, []);

  const navigate = useNavigate();
  // @ts-ignore
  const [fontSize, setFontSizeState] = useState<number>(16);
  const handleFontSizeChange = (newFontSize: number): void => {
    setFontSizeState(newFontSize);
    setFontSize(newFontSize); 
  };

  return (
    <div className = {styles.navContainer}>
      <div className = {styles.accOptions}>
        <div className= {styles.slideContainer}>
          <h4>Text Size</h4>
          <FontSizeSlider onFontSizeChange={handleFontSizeChange} />
        </div>
        <div id="google_translate_element" className={styles.translateButton}></div>
      </div>
      <div className = {styles.navOptions}>
        <button className = {styles.exitButton} onClick = {() => navigate("/")}>
          Back
        </button>
      </div>
    </div>
  );
}

/**
   * Helper function to get category name based on category_id
   *
   * @function
   * @returns {string} Category Name corresponding with ID
*/
const getCategoryName = (category_id: number): string => {
  const categoryNames = [
    'Milk Tea',
    'Fruit Tea',
    'Ice Blended',
    'Tea Mojito',
    'Brewed Tea',
    'Fresh Milk',
    'Creama',
    'Seasonal',
  ];
  return categoryNames[category_id - 1] || '';
};

/**
 * A simple React component that creates the display menu board
 * @component
 *
 * @returns {JSX.Element} React component
 */

function Display() {
  const serverAddress = 'https://shareteaapi.onrender.com';
  const [milkTeas, setMilkTeas] = useState<any[]>([]);
  const [fruitTeas, setFruitTeas] = useState<any[]>([]);
  const [iceBlends, setIceBlends] = useState<any[]>([]);
  const [teaMojos, setTeaMojos] = useState<any[]>([]);
  const [brewTeas, setBrewTeas] = useState<any[]>([]);
  const [freshMilks , setFreshMilks] = useState<any[]>([]);
  const [creamas, setCreamas] = useState<any[]>([]); 
  const [seasonal, setSeasonal] = useState<any[]>([]); 
  const [addOns, setAddOns] = useState<any[]>([]); 
  
  useEffect(() => {
    fetch(`${serverAddress}/db/drinks2/1`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setMilkTeas(data);
      })
      .catch((error) => {
        console.error('Error fetching drinks:', error);
      });
      
    fetch(`${serverAddress}/db/drinks2/2`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setFruitTeas(data);
      })
      .catch((error) => {
        console.error('Error fetching drinks:', error);
      });

    fetch(`${serverAddress}/db/drinks2/3`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setIceBlends(data);
      })
      .catch((error) => {
        console.error('Error fetching drinks:', error);
      });

    fetch(`${serverAddress}/db/drinks2/4`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setTeaMojos(data);
      })
      .catch((error) => {
        console.error('Error fetching drinks:', error);
      }); 

    fetch(`${serverAddress}/db/drinks2/5`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }) 
      .then((data) => {
        setBrewTeas(data);
      })
      .catch((error) => {
        console.error('Error fetching drinks:', error);
      });
      
    fetch(`${serverAddress}/db/drinks2/6`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setFreshMilks(data);
      })
      .catch((error) => {
        console.error('Error fetching drinks:', error);
      });
  
    fetch(`${serverAddress}/db/drinks2/7`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCreamas(data);
      })
      .catch((error) => {
        console.error('Error fetching drinks:', error);
      });
    
    fetch(`${serverAddress}/db/drinks2/8`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setSeasonal(data);
      })
      .catch((error) => {
        console.error('Error fetching drinks:', error);
      });

    fetch(`${serverAddress}/db/inventory`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
      })
      .then((data) => {
        setAddOns(data);
      })
      .catch((error) => {
        console.error('Error fetching Add Ons:', error);
      });
      
  }, []);



  return (
    <div className={styles.display}>
      <Header/>
      <h1 className={styles.title}>ShareTea</h1>
      <div className={styles.container}>
          {/* Milk Tea */}
            <div className={styles.milk_tea}>
              <h2>{getCategoryName(1)}</h2>
              <table className={styles.table}>
                <tbody>
                  {milkTeas.map((drink) => (
                    <tr key={drink.drink_id}>
                      <td>{drink.drink_name}</td>
                      <td>{drink.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          {/* Fruit Tea */}
          <div className={styles.fruit_tea}>
          <h2>{getCategoryName(2)}</h2>
            <table className={styles.table}>
              <tbody>
                {fruitTeas.map((drink) => (
                  <tr key={drink.drink_id}>
                    <td>{drink.drink_name}</td>
                    <td>{drink.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Ice Blended */}
          <div className={styles.ice_blend}>
          <h2>{getCategoryName(3)}</h2> 
            <table className={styles.table}>
              <tbody>
                {iceBlends.map((drink) => (
                  <tr key={drink.drink_id}>
                    <td>{drink.drink_name}</td>
                    <td>{drink.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Tea Mojito */}
          <div className={styles.tea_mojito}>
            <h2>{getCategoryName(4)}</h2>
            <table className={styles.table}>
              <tbody>
                {teaMojos.map((drink) => (
                  <tr key={drink.drink_id}>
                    <td>{drink.drink_name}</td>
                    <td>{drink.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Brewed Tea */}
          <div className={styles.brew_tea}>
            <h2>{getCategoryName(5)}</h2>
            <table className={styles.table}>
              <tbody>
                {brewTeas.map((drink) => (
                  <tr key={drink.drink_id}>
                    <td>{drink.drink_name}</td>
                    <td>{drink.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Fresh Milk */}
          <div className={styles.fresh_milk}>
            <h2>{getCategoryName(6)}</h2>
            <table className={styles.table}>
              <tbody>
                {freshMilks.map((drink) => (
                  <tr key={drink.drink_id}>
                    <td>{drink.drink_name}</td>
                    <td>{drink.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Creama */}
          <div className={styles.creama}>
            <h2>{getCategoryName(7)}</h2>
            <table className={styles.table}>
              <tbody>
                {creamas.map((drink) => (
                  <tr key={drink.drink_id}>
                    <td>{drink.drink_name}</td>
                    <td>{drink.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Seasonal */}
          <div className={styles.seasonal}>
            <h2>{getCategoryName(8)}</h2>
            <table className={styles.table}>
              <tbody>
                {seasonal.map((drink) => (
                  <tr key={drink.drink_id}>
                    <td>{drink.drink_name}</td>
                    <td>{drink.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.add_ons}>
          <h2>Add Ons</h2>
          <table className={styles.table}>
            <tbody>
              {addOns
                .filter((item) => addOnIDs.includes(item.inventory_item_id))
                .map((addOn) => (
                  <tr key={addOn.inventory_item_id}>
                    <td>{addOn.name}</td>
                    <td>{addOn.price}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



export default Display;