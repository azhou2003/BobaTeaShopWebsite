import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import style from './Cashier.module.css';
import { Link, useNavigate } from 'react-router-dom';
import FontSizeSlider from './FontSizeSlider';
import setFontSize from './fontSizeUtility';

const serverAddress = 'https://shareteaapi.onrender.com';
// const serverAddress = 'http://localhost:8080';

// Interfaces to store information retrieved from or to be submitted to the database

/**
 * An interface used to store category entries retrieved from the database
 * @interface
 */
interface Category {
  category_id: number;
  category_name: string;
}

/**
 * An interface used to store drink entries retrieved from the database
 * @interface
 */
interface Drink {
  drink_id: number;
  drink_name: string;
  price: number;
  category_id: number;
}

/**
 * An interface used to store order entries to be pushed to the database
 * @interface
 */
interface Order {
  item_id: number;
  item_name: string;
  price: number;
  is_drink: boolean;
}

/**
 * An interface used to store addon entries
 * @interface
 */
interface Addon {
  item_id: number;
  item_name: string;
}

const Addons: Addon[] = [
  { item_id: 6, item_name: "Pearl" },
  { item_id: 7, item_name: "Mini Pearl" },
  { item_id: 8, item_name: "Ice Cream" },
  { item_id: 9, item_name: "Pudding" },
  { item_id: 10, item_name: "Aloe Vera" },
  { item_id: 11, item_name: "Red Bean" },
  { item_id: 12, item_name: "Herb Jelly" },
  { item_id: 13, item_name: "Aiyu Jelly" },
  { item_id: 14, item_name: "Lychee Jelly" },
  { item_id: 15, item_name: "Crema" },
  { item_id: 16, item_name: "Crystal Boba" },
];

/**
 * A simple React component used for the header of the cashier page.
 *
 * @component
 * @returns {JSX.Element} React component
 */
const Header = () => {
  // Flag to ensure the useEffect runs only once
  const hasEffectRun = useRef(false);

  /**
   * Initializes the Google Translate element.
   *
   * @ignore
   * @function
   * @returns {void}
   */
  const googleTranslateElementInit = () => {
    // @ts-ignore
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    // Run only once to initialize Google Translate script
    if (!hasEffectRun.current) {
      console.log('rendered translate once');
      // Dynamically add Google Translate script to the document
      var addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
      // @ts-ignore
      window.googleTranslateElementInit = googleTranslateElementInit;

      // Update the flag to indicate that the effect has run
      hasEffectRun.current = true;
    }
  }, []);

  const navigate = useNavigate();

  // State for controlling font size
  // @ts-ignore
  const [fontSize, setFontSizeState] = useState<number>(16);

  /**
   * Handles the change in font size and updates the state.
   *
   * @param {number} newFontSize - The new font size value.
   * @returns {void}
   */
  const handleFontSizeChange = (newFontSize: number): void => {
    setFontSizeState(newFontSize);
    // Call external setFontSize function with the new font size
    setFontSize(newFontSize);
  };

  return (
    <div className={style.navContainer}>
      <div className={style.accOptions}>
        <div className={style.slideContainer}>
          <h4>Text Size</h4>
          {/* Font size slider component */}
          <FontSizeSlider onFontSizeChange={handleFontSizeChange} />
        </div>
        {/* Google Translate element container */}
        <div id="google_translate_element" className={style.translateButton}></div>
      </div>
      <div className={style.navOptions}>
        {/* Exit button */}
        <button className={style.exitButton} onClick={() => navigate("/")}>
          Exit
        </button>
      </div>
    </div>
  );
}

/**
 * A simple React component that handles the functionality and creates an interactive render for the cashier/manager
 * @component
 *
 * @returns {JSX.Element} React component
 */
function Cashier() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]); 
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null); 
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sugarSelection, setSugarSelection] = useState<number>(0);
  const [iceSelection, setIceSelection] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<Order[]>([]);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [addonSelection, setAddonSelection] = useState<Addon[]>([]);
  const [orderItemsList, setOrderItemsList]  = useState<boolean[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showManagerButtons, setShowManagerButtons] = useState(false);

  /**
   * Effect hook to manage the display of the manager buttons
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    // Fetch the list of categories from your backend
    const storedIsManager = sessionStorage.getItem('isManager');
    const isManager = storedIsManager ? JSON.parse(storedIsManager) : false;

    if (isManager) {
      setShowManagerButtons(true);
    }
    fetch(`${serverAddress}/db/categories`)
      .then((response) => response.json())
      .then((data: Category[]) => {
        data.sort((a: Category, b: Category) => a.category_id - b.category_id);
        setCategories(data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  /**
   * Effect hook to recalculate the order total when the order items change.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    handleOrderTotal();
  }, [orderItems]);


  /**
   * Handles a click on a category, fetching drinks in the selected category.
   *
   * @function
   * @param {number} categoryId - The ID of the selected category.
   * @returns {void}
   */
  const handleCategoryClick = (categoryId: number) => {
    // Fetch drinks in the selected category
    fetch(`${serverAddress}/db/drinks/${categoryId}`)
      .then((response) => response.json())
      .then((data: any[]) => {
        const drinksData = data.map((item) => ({
          drink_id: item[0] as number,
          category_id: item[1] as number,
          price: item[2] as number,
          drink_name: item[3] as string,
        }));
        setDrinks(drinksData);
      })
      .catch((error) => {
        console.error('Error fetching drinks:', error);
      });
  
    // Update the selected category
    setSelectedCategory(categoryId);
  };

  /**
   * Resets the selected category, drink, sugar, ice, and addons, and clears the order items list.
   *
   * @function
   * @returns {void}
   */
  const resetCategory = () => {
    setSelectedCategory(null);
    setSelectedDrink(null);
    setSugarSelection(0);
    setIceSelection(0);
    setAddonSelection([]);
    setOrderItemsList([]);
  };

  /**
   * Handles a click on a sugar button, setting the sugar selection.
   *
   * @function
   * @param {number} buttonId - The ID of the clicked sugar button.
   * @returns {void}
   */
  const handleSugarButtonClick = (buttonId: number) => {
    setSugarSelection(buttonId);
  };

  /**
   * Handles a click on an ice button, setting the ice selection.
   *
   * @function
   * @param {number} buttonId - The ID of the clicked ice button.
   * @returns {void}
   */
  const handleIceButtonClick = (buttonId: number) => {
    setIceSelection(buttonId);
  };

  /**
   * Handles the selection or deselection of an addon item.
   *
   * @function
   * @param {Addon} item - The addon item to be selected or deselected.
   * @param {boolean} shouldAdd - Indicates whether the item should be added (true) or removed (false).
   * @returns {void}
   */
  const handleAddonSelection = (item: Addon, shouldAdd: boolean) => {
    setAddonSelection((prevSelectedItems) => {
      if (shouldAdd) {
        if (!prevSelectedItems.includes(item)) {
          return [...prevSelectedItems, item];
        }
      } else {
        if (prevSelectedItems.includes(item)) {
          return prevSelectedItems.filter((selected) => selected !== item);
        }
      }
      return prevSelectedItems;
    });
  };

  /**
   * Handles a click on a drink button, setting the selected drink.
   *
   * @function
   * @param {Drink} drink - The drink object representing the clicked drink button.
   * @returns {void}
   */
  const handleDrinkButtonClick = (drink: Drink) => {
    setSelectedDrink(drink);
  };

  /**
   * Clears the order items, effectively clearing the current order.
   *
   * @function
   * @returns {void}
   */
  const handleClearOrder = () => {
    setOrderItems([]);
  };

  /**
   * Adds the selected drink, sugar, ice, and addons to the order items.
   *
   * @function
   * @returns {void}
   */
  const handleAddOrder = () => {

    if (selectedDrink) {
      const currentDrink: Order = {
        item_id: selectedDrink.drink_id,
        item_name: selectedDrink.drink_name,
        price: selectedDrink.price,
        is_drink: true
      };

      setOrderItems((prevItems: Order[]) => [
        ...prevItems,
        currentDrink
      ]);
    }

    if (sugarSelection){
      const currentSugar: Order = {
        item_id: 35,
        item_name: 'Sugar',
        price: 0,
        is_drink: false
      }

      for(let i = 0; i < sugarSelection; i++){

        setOrderItems((prevItems: Order[]) => [
          ...prevItems,
          currentSugar
        ]);

      }
    }

    if (iceSelection){
      const currentIce: Order = {
        item_id: 52,
        item_name: 'Ice',
        price: 0,
        is_drink: false
      }

      for(let i = 0; i < iceSelection; i++){

        setOrderItems((prevItems: Order[]) => [
          ...prevItems,
          currentIce
        ]);

      }
    }

    if (addonSelection.length === 0){}
    else{

      for (const item of addonSelection){
        const currentAddon: Order = {
          item_id: item.item_id,
          item_name: item.item_name,
          price: 0.75,
          is_drink : false
        }

        setOrderItems((prevItems: Order[]) => [
          ...prevItems,
          currentAddon
        ]);

      }
    }
  };

  /**
   * Calculates and sets the total price of the current order.
   *
   * @function
   * @returns {void}
   */
  const handleOrderTotal = () => {

    let total: number = 0;

    for (const item of orderItems){
      total += item.price;
    }

    setOrderTotal(total);
  };

  /**
   * Toggles the selection status of an item in the order items list.
   *
   * @function
   * @param {number} index - The index of the item in the order items list.
   * @returns {void}
   */
  const handleToggleSelection = (index: number) => {
    setOrderItemsList((prevSelection) => {
      const updatedSelection = [...prevSelection];
      updatedSelection[index] = !updatedSelection[index];
      return updatedSelection;
    });
  };

  /**
   * Clears the selected items from the order.
   *
   * @function
   * @returns {void}
   */
  const handleClearSelected = () => {
    const updatedOrderItems = orderItems.filter((item, index) => {
      console.log(item);
      return !orderItemsList[index]; 
    });
  
    const updatedOrderItemsList = orderItemsList.filter((selected) => !selected);
  
    setOrderItems(updatedOrderItems);
    setOrderItemsList(updatedOrderItemsList);
  };

  /**
   * Submits the current order to the backend for processing.
   *
   * @function
   * @returns {void}
   */
  const handleSubmitOrder = async () => {
    try {
      const response1 = await fetch(`${serverAddress}/db/order/add/${orderTotal}`, { method: 'POST' });
  
      if (!response1.ok) {
        console.error('First request failed.');
        return;
      }
  
      const orderResponse = await response1.json(); 
      const next_order_ID = orderResponse.next_order_ID;
  
      for (const item of orderItems) {
        if (item.is_drink) {
          const response2 = await fetch(`${serverAddress}/db/order/addDrink/${next_order_ID}/${item.item_id}`, { method: 'POST' });
          if (!response2.ok) {
            console.error('Second request failed.');
          }
        } 
        else {
          const response3 = await fetch(`${serverAddress}/db/order/addIngredient/${next_order_ID}/${item.item_id}`, { method: 'POST' });
          if (!response3.ok) {
            console.error('Third request failed.');
          }
        }
      }
  
      handleClearOrder();
      setSuccessMessage('Order Submitted Successfully!');

      // Clear the success message after a delay (e.g., 2 seconds)
      setTimeout(() => {
        setSuccessMessage(null);
      }, 1000);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  

  return (
    <div className = {style.cashierPage}>
      <Header/>
      {successMessage && (
        <div className={style.overlay}>
          <div className={style.successMessageOverlay}>
            {successMessage}
          </div>
        </div>
      )}
      <div className={style.cashierContainer}>
        <div className={style.categoryDrink}>
          {selectedCategory === null ? (
            <h3>Categories</h3>
          ) : (
            <h3>{categories[selectedCategory - 1].category_name}</h3>
          )}
          {selectedCategory === null ? (
            <div className={style.categoryButtons}>
              {categories.map((category) => (
                <button
                  key={category.category_id}
                  onClick={() => handleCategoryClick(category.category_id)}
                  className={style.categoryButton}
                >
                  {category.category_name}
                </button>
              ))}
            </div>
          ) : (
            <div className={style.drinkButtons}>
              {drinks.map((drink) => (
                <button
                  key={drink.drink_id}
                  className={`${style.drinkButton} ${
                    selectedDrink === drink ? style.selected : ''
                  }`}
                  onClick={() => handleDrinkButtonClick(drink)}
                >
                  {drink.drink_name}
                </button>
              ))}
              <button onClick={resetCategory} className={style.resetButton}>
                Reset
              </button>
            </div>
          )}
        </div>
    
        <div className={style.list}>
          <h3>Order</h3>
          <ul className={style.orderList}>
            {orderItems.map((item, index) => (
              <li key={index} className={style.orderListItem}>
                <label htmlFor={`item-${index}`} className={`${style.itemContainer} ${item.is_drink ? style.drinkItem : style.ingredientItem}`}>
                  <input
                    type="checkbox"
                    id={`item-${index}`}  
                    checked={orderItemsList[index]}
                    onChange={() => handleToggleSelection(index)}
                  />
                  <div className={style.orderItemContent}>
                    <span className={style.itemName}>{item.item_name}</span>
                    <span className={style.itemPrice}>${item.price.toFixed(2)}</span>
                  </div>
                </label>
              </li>
            ))}
          </ul>
          <div className={style.orderTotal}>
            <h3>Order Total: ${orderTotal.toFixed(2)}</h3>
          </div>
          <div className={style.buttonColumn}>
            <button
              onClick={() => {
                handleAddOrder();
                resetCategory();
              }}
            >
              +
            </button>
            <button onClick={handleClearSelected}>-</button>
            <button onClick={handleSubmitOrder}>✓</button>
          </div>
        </div>
    
        {showManagerButtons && (
          <div className={style.managerButtons}>
            <h3>Manager</h3>
            <Link to="/inventory">
              <button>Inventory</button>
            </Link>
            <Link to="/menu">
              <button>Menu</button>
            </Link>
            <Link to="/reports">
              <button>Reports</button>
            </Link>
          </div>
        )}

        <div className={style.panels}>
          <div className={style.panel1}>
            <h3>Sugar Serving</h3>
            <div className={style.panelButtons}>
              {[0, 1, 2, 3, 4].map((buttonId) => (
                <button
                  key={buttonId}
                  onClick={() => handleSugarButtonClick(buttonId)}
                  className={`${style.panelButton} ${
                    sugarSelection === buttonId ? style.selected : ''
                  }`}
                >
                  {buttonId}
                </button>
              ))}
            </div>
          </div>
          <div className={style.panel2}>
            <h3>Ice Serving</h3>
            <div className={style.panelButtons}>
              {[0, 1, 2].map((buttonId) => (
                <button
                  key={buttonId}
                  onClick={() => handleIceButtonClick(buttonId)}
                  className={`${style.panelButton} ${
                    iceSelection === buttonId ? style.selected : ''
                  }`}
                >
                  {buttonId}
                </button>
              ))}
            </div>
          </div>
          <div className={style.panel3}>
            <h3>Add-ons</h3>
            <div className={style.panelButtons}>
              {Addons.map((addon) => (
                <button
                  key={addon.item_id}
                  onClick={() =>
                    handleAddonSelection(addon, !addonSelection.includes(addon))
                  }
                  className={`${style.panelButton} ${
                    addonSelection.includes(addon) ? style.selected : ''
                  }`}
                >
                  {addon.item_name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cashier;




