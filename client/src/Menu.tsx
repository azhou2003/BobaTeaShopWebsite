import { useState, useEffect, useRef } from "react";
// @ts-ignore
import styles from "./Inventory.module.css";
import { useNavigate } from "react-router-dom";
import FontSizeSlider from "./FontSizeSlider";
import setFontSize from "./fontSizeUtility";


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
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    if (!hasEffectRun.current) {
      console.log("rendered translate once");
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
    <div className={styles.navContainer}>
      <div className={styles.accOptions}>
        <div className={styles.slideContainer}>
          <h4>Text Size</h4>
          <FontSizeSlider onFontSizeChange={handleFontSizeChange} />
        </div>
        <div
          id="google_translate_element"
          className={styles.translateButton}
        ></div>
      </div>
      <div className = {styles.navOptions}>
        <button className = {styles.exitButton} onClick = {() => navigate("/cashier")}>
          Back
        </button>
      </div>
    </div>
  );
};


/**
 * A simple React component that gives feedback on manager action
 * @component
 *
 * @returns {JSX.Element} React component
 */

interface PopupProps {
  message: string;
  isVisible: boolean;
}

const Popup: React.FC<PopupProps> = ({ message, isVisible }) => {
  return (
    <div className={`${styles.popup} ${isVisible ? styles.visible : ""}`}>
      {message}
    </div>
  );
};

/**
 * A simple React component that creates the drink menu page
 * @component
 *
 * @returns {JSX.Element} React component
 */
function Menu() {
  const [drinksMenu, setDrinksMenu] = useState<any[]>([]);

  //const serverAddress = 'http://localhost:8080';
  const serverAddress = "https://shareteaapi.onrender.com";
  const dataTable = "drinks";
  const [addDrinkName, setAddDrinkName] = useState("");
  const [addDrinkCategory, setAddDrinkCategory] = useState("");
  const [addDrinkPrice, setAddDrinkPrice] = useState("");
  const [removeDrinkId, setRemoveDrinkId] = useState("");
  const [updateDrinkId, setUpdateDrinkId] = useState("");
  const [updateDrinkPrice, setUpdateDrinkPrice] = useState("");

  // Popup state
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);

  const showPopup = (message: any) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 3000); // Hide the popup after 3 seconds
  };

  useEffect(() => {
    fetch(`${serverAddress}/db/${dataTable}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDrinksMenu(data);
      })
      .catch((error) => {
        console.error("Error fetching drinks:", error);
      });
  }, []);

  const addDrink = () => {
    
    // Validate the price
    const newPrice = parseFloat(addDrinkPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      console.error("Invalid price provided. Price should be a positive number.");
      showPopup("Failed to add drink. Make sure your values are valid");
      clearAddDrinkFields();
      return;
    }

    //POST request to the server to add the drink
    fetch(
      `${serverAddress}/db/${dataTable}/add/${addDrinkCategory}/${addDrinkName}/${addDrinkPrice}`,
      {
        method: "POST",
      }
    )
    .then((response) => response.json())
      .then((newDrink) => {
        setDrinksMenu((drinksMenu) => [...drinksMenu, newDrink]);
        
      })
      .catch((error) => {
        console.error("Error adding drink:", error);
      });
    showPopup("Drink added successfully!");
    clearAddDrinkFields();
  };

  const removeDrink = () => {

    // Check if the drink ID exists in drinksMenu
    const drinkToRemove = drinksMenu.find(
      (drink) => drink.drink_id === parseInt(removeDrinkId, 10)
    );

    if (!drinkToRemove) {
      // If the drink is not found, show an error popup
      showPopup("Drink not found for removal");
      clearUpdateDrinkFields();
      return;
    }
    // Make a DELETE request to the server to remove the Drink using fetch:
    fetch(`${serverAddress}/db/${dataTable}/remove/${removeDrinkId}`, {
      method: "POST",
    })
      .then(() => {
        setDrinksMenu(
          drinksMenu.filter(
            (drink) => drink.drink_id !== parseInt(removeDrinkId, 10)
          )
        );
        showPopup("Drink removed successfully!");
      })
      .catch((error) => {
        console.error("Error removing drink:", error);
        showPopup("Failed to remove drink");
      });
    clearRemoveDrinkFields();
  };

  const updateDrink = () => {
    const drinkToUpdate = drinksMenu.find(
      (drink) => drink.drink_id === parseInt(updateDrinkId, 10)
    );

    if (!drinkToUpdate) {
      // If the drink is not found, show an error popup
      showPopup("Failed to update drink. Drink not found");
      clearUpdateDrinkFields();
      return;
    }
    //Update the price of a drink on the menu
    const newPrice = parseFloat(updateDrinkPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      console.error("Invalid price provided. Price should be a positive number.");
      showPopup("Failed to update drink. Price is invalid");
      clearUpdateDrinkFields();
      return;
    }

    fetch(
      `${serverAddress}/db/drink/changePrice/${updateDrinkId}/${updateDrinkPrice}`,
      {
        method: "POST",
      }
    )
      .then(() => {
        setDrinksMenu((drinks) =>
          drinks.map((drink) => {
            if (drink.drink_id === parseInt(updateDrinkId, 10)) {
              return {
                ...drink,
                price: parseFloat(updateDrinkPrice),
              };
            }
            return drink;
          })
        );
        showPopup("Drink updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating drink:", error);
      });

    clearUpdateDrinkFields();
  };

  const clearAddDrinkFields = () => {
    setAddDrinkName("");
    setAddDrinkCategory("");
    setAddDrinkPrice("");
  };

  const clearRemoveDrinkFields = () => {
    setRemoveDrinkId("");
  };

  const clearUpdateDrinkFields = () => {
    setUpdateDrinkId("");
    setUpdateDrinkPrice("");
  };

  return (
    <div className={styles.inventory}>
      <Header />
      <Popup message={popupMessage} isVisible={isPopupVisible} />
      <h1 className={styles.title}>Drink Menu</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Drink ID</th>
            <th>Category ID</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {drinksMenu.map((drink) => (
            <tr key={drink.drink_id}>
              <td>{drink.drink_id}</td>
              <td>{drink.category_id}</td>
              <td>{drink.drink_name}</td>
              <td>{drink.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add drink Section */}
      <h2 className={styles.section}>Add Drink</h2>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={addDrinkName}
          onChange={(e) => setAddDrinkName(e.target.value)}
        />
        <select
          value={addDrinkCategory}
          onChange={(e) => setAddDrinkCategory(e.target.value)}
        >
          {/*TODO: ADD DRINK Category ID's */}
          <option value=""> Select Category </option>
          <option value="1"> Milk Tea </option>
          <option value="2"> Fruit Tea </option>
          <option value="3"> Ice Blended </option>
          <option value="4"> Tea Mojito </option>
          <option value="5"> Brewed Tea </option>
          <option value="6"> Fresh Milk </option>
          <option value="7"> Creama </option>
          <option value="8"> Seasonal </option>
        </select>

        <input
          type="number"
          placeholder="Price"
          value={addDrinkPrice}
          onChange={(e) => setAddDrinkPrice(e.target.value)}
        />

        <button onClick={addDrink} className={styles.button}>
          Add
        </button>
      </div>

      {/* Remove Drink Section */}
      <h2 className={styles.section}>Remove Drink</h2>
      <div>
        <input
          type="number"
          placeholder="Drink ID"
          value={removeDrinkId}
          onChange={(e) => setRemoveDrinkId(e.target.value)}
        />
        <button onClick={removeDrink} className={styles.button}>
          Remove
        </button>
      </div>

      {/* Update Drink Section */}
      <h2 className={styles.section}>Update Drink </h2>
      <div>
        <input
          type="number"
          placeholder="Enter Drink ID"
          value={updateDrinkId}
          onChange={(e) => setUpdateDrinkId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter New Price"
          value={updateDrinkPrice}
          onChange={(e) => setUpdateDrinkPrice(e.target.value)}
        />
        <button onClick={updateDrink} className={styles.button}>
          Update
        </button>
      </div>
    </div>
  );
}

export default Menu;
