import { useState, ReactNode, useEffect, useRef } from 'react';
// @ts-ignore
import styles from './Cart.module.css';
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { useDrinkContext } from './DrinkContext';
import FontSizeSlider from './FontSizeSlider';
import setFontSize from './fontSizeUtility';
// @ts-ignore
import cartTitle from '/src/public/YourCart.png';


const serverAddress = 'https://shareteaapi.onrender.com';
// const serverAddress = 'http://localhost:8080';

const toppingList=[{name:'Pearl', id:6}, {name:'Mini Pearl', id:7}, {name:'Ice Cream', id:8}, {name:"Pudding", id:9}, {name:"Aloe Vera", id:10}, {name:"Red Bean", id:11}, {name:"Herb Jelly", id:12}, {name:"Aiyu Jelly", id:13}, {name:"Lychee Jelly", id:14}, {name:"Creama", id:15}, {name:"Crystal Boba", id:16}];



const Modal: React.FC<{ children: ReactNode}> = ({ children}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {children}
      </div>
    </div>
  );
};

const ModalTwo: React.FC<{ children: ReactNode; onClose: () => void }> = ({ children, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

const Header = () => {
  const [fontSize, setFontSizeState] = useState<number>(16);
  console.log("font size",fontSize);

  const hasEffectRun = useRef(false);

  const handleFontSizeChange = (newFontSize: number): void => {
    setFontSizeState(newFontSize);
    setFontSize(newFontSize); 
  };

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

  return (
    <div className={styles.header}>
      <div className={styles.left_buttons}>
        <ul className={styles.buttonList}>
        <li><h3>Accessibility:</h3></li>
        <li>
          <span className={styles.accessTitles}>Text Size</span>
          <FontSizeSlider onFontSizeChange={handleFontSizeChange}></FontSizeSlider>
        </li>
        <li>
            <span className={styles.accessTitles}>Language</span>
            <div id="google_translate_element" className={styles.translateButton}></div>
          </li>
        <li><button className={styles.accessible}>Weather</button></li>
      </ul>
        
      </div>
      <div className={styles.title_and_button}>
        <div className={styles.title}>
          <img className={styles.titleImg} src={cartTitle} alt="Your Cart"></img>
        </div>
        <div>
          <Link to="/cart">
              <button className={styles.cartButton}>
              <FontAwesomeIcon className={styles.cartIcon} icon={faCartShopping} />
              </button>
          </Link>
        </div>
      </div>
      
    </div>
  );
}


  

const CartList = () => {
  const { cart, removeFromCart, handleSubmitOrder, updateOrder } = useDrinkContext();
  // const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<any>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toggleButtons] = useState(true);
  const [selectedToppings, setSelectedToppings] = useState<{name:string, id:number}[]>([]);
  //const { submitOrder } = useDrinkContext();

  const handleToggleTopping = (topping: { name: string, id: number }) => {
    // Toggle the topping in the selectedToppings array
    if (selectedToppings.some((selected) => selected.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((selected) => selected.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
    console.log('Selected Toppings:', selectedToppings);
  };

  const handleEditClick = (drink: any) => {
    setSelectedDrink(drink);
    setSelectedToppings(drink.addons);
    setShowModal(true);
  };

  const handleUpdate = () => {
    const updatedDrink = {
      ...selectedDrink,
      sweetness: selectedDrink.sweetness,
      ice: selectedDrink.ice,
      addons: selectedToppings,
    };

    updateOrder(updatedDrink);
    setShowModal(false);
  };

  
  const handleRemove = (currDrink: number) => {
    removeFromCart(currDrink);
  };

  const handleCheckout = async () => {
    try {
      await handleSubmitOrder(serverAddress, totalPrice);
      setCheckoutStatus('Submitted');
      setTimeout(() => {
        setCheckoutStatus(null);
      }, 3000);
    } catch (error) {
      console.error('An error occurred during order submission:', error);
      setCheckoutStatus('Error');

      // Reset checkout status after 3 seconds
      setTimeout(() => {
        setCheckoutStatus(null);
      }, 3000);
    }
  };

  
    // Calculate total price
  const totalPrice = cart.reduce((sum, drink) => {
    // Add drink price
    let drinkPrice = drink.price;
  
    // Add addon prices
    if (drink.addons && drink.addons.length > 0) {
      drinkPrice += drink.addons.reduce((addonSum, addon) => {
        // Check if the addon is Creama (id: 15)
        const addonPrice = addon.id === 15 ? 1.25 : 0.75;
        return addonSum + addonPrice;
      }, 0);
    }
  
    return sum + drinkPrice;
  }, 0);


  return (
    <div className={`${styles.cartList} ${styles.cartListContainer}`}>
        <ul>
            <li className={styles.headerItem}>
                <span className={styles.drinkColumn}>Drink Name</span>
                <span className={styles.priceColumn}>Price</span>
                <span className={styles.sweetnessColumn}>Sugar</span>
                <span className={styles.iceColumn}>Sweetness</span>
                <span className={styles.addonsColumn}>Add-ons</span>
            </li>
            {cart.map((drink) => (
                <li key={drink.id} className={styles.drinkItem}>
                    <span className={styles.drinkColumn}>{drink.name}</span>
                    <span className={styles.priceColumnInfo}>${drink.price.toFixed(2)}</span>
                    <span className={styles.iceColumn}>{drink.ice}</span>
                    <span className={styles.sweetnessColumn}>{drink.sweetness}%</span>
                    <span className={styles.addonsColumn}>{drink.addons.map(addon => addon.name).join(', ')}</span>
                    <button className={styles.editButton} onClick={() => handleEditClick(drink)}>
                      Edit
                    </button>
                    

                    <button className={styles.removeButton}
                      onClick={() => {
                        handleRemove(drink.id);
                      }}
                    >Remove</button>
                </li>
            ))}
        </ul>
        <div className={styles.totalPrice}>
            <span>Total: </span>
            <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className={styles.buttonsContainer}>
            <Link to="/">
                <button className={styles.returnButton}>Return</button>
            </Link>
            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Checkout
            </button>
            {showModal && (
              <ModalTwo onClose={() => setShowModal(false)}>
                <h2 className={styles.h3Topping}>{selectedDrink?.name}</h2>
                <label>
                  <div><h3 className={styles.h3Topping}>Sweetness:</h3></div>
                  <select
                    className={styles.selectDrop}
                    value={selectedDrink?.sweetness}
                    onChange={(e) => setSelectedDrink({ ...selectedDrink, sweetness: parseInt(e.target.value, 10) })}
                  >
                    <option value={100}>100%</option>
                    <option value={80}>80%</option>
                    <option value={50}>50%</option>
                    <option value={30}>30%</option>
                    <option value={0}>0%</option>
                  </select>
                </label>
                <label>
                  <div><h3 className={styles.h3Topping}>Ice:</h3></div>
                  <select
                    className={styles.selectDrop}
                    value={selectedDrink?.ice}
                    onChange={(e) => setSelectedDrink({ ...selectedDrink, ice: e.target.value })}
                  >
                    <option value="Regular ice">Regular ice</option>
                    <option value="Less ice">Less ice</option>
                    <option value="No ice">No ice</option>
                  </select>
                </label>
                {toggleButtons && (
                  <div>
                    <h3 className={styles.h3Topping}>Toppings:</h3>
                    {/* Toggle buttons for toppings */}
                    <div className={styles.toppingsContainer}>
                      {toppingList.map((topping: { name: string, id: number }) => (
                        <button
                          key={topping.id}
                          className={
                            selectedToppings.some((selected) => selected.id === topping.id)
                              ? styles.toggleButtonActive
                              : styles.toggleButton
                          }
                          onClick={() => handleToggleTopping(topping)}
                        >
                          {topping.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button className={styles.addCartBtnModal} onClick={handleUpdate} >
                  Update
                </button>
              </ModalTwo>
            )}
            {checkoutStatus && (
              <Modal>
                <div className={checkoutStatus === 'Submitted' ? styles.submittedMessage : styles.errorMessage}>
                  {checkoutStatus}
                </div>
              </Modal>
            )}
        </div>
    </div>
  );
}

function Cart() {
  useEffect(() => {
    document.body.classList.add(styles.cart_body);
    return () => {
      document.body.classList.remove(styles.cart_body);
    };
  }, []);
    return(
        <div className={styles.cart}>
          <Header/>
          <br></br>
          <CartList/>
       </div>
    )
}

export default Cart;