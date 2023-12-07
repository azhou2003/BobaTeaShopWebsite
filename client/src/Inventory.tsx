import { useState, useEffect, useRef } from "react";
// @ts-ignore
import styles from "./Inventory.module.css";
import { useNavigate } from "react-router-dom";
import FontSizeSlider from "./FontSizeSlider";
import setFontSize from "./fontSizeUtility";

/**
 * A simple React component that creates the header for the Inventory page
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
 * A simple React component that creates the inventory page
 * @component
 *
 * @returns {JSX.Element} React component
 */
function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);

  // const serverAddress = 'http://localhost:8080';
  const serverAddress = "https://shareteaapi.onrender.com";
  const dataTable = "inventory";

  const [addItemName, setAddItemName] = useState("");
  const [addItemAllergens, setAddItemAllergens] = useState("");
  const [addItemStock, setAddItemStock] = useState("");
  const [addItemStockUnitType, setAddItemStockUnitType] = useState("");
  const [addItemPerishable, setAddItemPerishable] = useState("");
  const [addItemStorageRequirements, setAddItemStorageRequirements] =
    useState("");
  const [addItemPrice, setAddItemPrice] = useState("");
  const [removeItemId, setRemoveItemId] = useState("");
  const [updateItemId, setUpdateItemId] = useState("");
  const [updateItemQuantity, setUpdateItemQuantity] = useState("");
  const [updateItemPrice, setUpdateItemPrice] = useState("");

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
        setInventory(data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  const addInventoryItem = () => {

    //Validate stock
    const newStock = parseInt(addItemStock);
    if (isNaN(newStock) || newStock < 0) {
      console.error("Invalid stock provided. Stock should be a positive number.");
      showPopup("Failed to add item. Stock is invalid");
      clearAddItemFields();
      return;
    }

    // Validate the price
    const newPrice = parseFloat(addItemPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      console.error("Invalid price provided. Price should be a positive number.");
      showPopup("Failed to add item. Price is invalid");
      clearAddItemFields();
      return;
    }

    //POST request to the server to add the item
    fetch(
      `${serverAddress}/db/${dataTable}/addItem/${addItemName}/${addItemAllergens}/${addItemStock}/${addItemStockUnitType}/${addItemPerishable}/${addItemStorageRequirements}/${addItemPrice}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((newItem) => {
        setInventory([...inventory, newItem]);
      })
      .catch((error) => {
        console.error("Error adding item:", error);
      });
    showPopup("Item added successfully!");
    clearAddItemFields();
  };

  const removeInventoryItem = () => {
    // Check if the drink ID exists in drinksMenu
    const itemToRemove = inventory.find(
      (item) => item.inventory_item_id === parseInt(removeItemId, 10)
    );

    if (!itemToRemove) {
      // If the drink is not found, show an error popup
      showPopup("Item not found for removal");
      clearRemoveItemFields();
      return;
    }

    // Make a DELETE request to the server to remove the item using fetch:
    fetch(`${serverAddress}/db/${dataTable}/remove/${removeItemId}`, {
      method: "POST",
    })
      .then(() => {
        setInventory(
          inventory.filter(
            (item) => item.inventory_item_id !== parseInt(removeItemId, 10)
          )
        );
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
    showPopup("Item removed successfully!");
    clearRemoveItemFields();
  };

  const updateInventoryItem = () => {
    //Check if Item exists
    const itemToUpdate = inventory.find(
      (item) => item.inventory_item_id === parseInt(updateItemId, 10)
    );

    if (!itemToUpdate) {
      // If the drink is not found, show an error popup
      showPopup("Item not found for update");
      clearUpdateItemFields();
      return;
    }

    // Check if the updateItemQuantity is a valid number
    const newQuantity = parseInt(updateItemQuantity, 10);
    let goodQuant: boolean = !isNaN(newQuantity) && newQuantity >= 0;

    // Check if the updateItemPrice is a valid number
    const newPrice = parseFloat(updateItemPrice);
    let goodPrice: boolean = !isNaN(newPrice) && newPrice >= 0;

      // Update the quantity of an item in the inventory
    if (goodQuant) {
      fetch(
        `${serverAddress}/db/${dataTable}/changeStock/${updateItemId}/${newQuantity}`,
        {
          method: "POST",
        }
      )
        .then(() => {
          setInventory((items) =>
            items.map((item) => {
              if (item.inventory_item_id === parseInt(updateItemId, 10)) {
                return {
                  ...item,
                  stock:
                    isNaN(newQuantity) || newQuantity < 0 ? item.stock : newQuantity,
                };
              }
              return item;
            })
          );
        })
        .catch((error) => {
          console.error("Error updating quantity:", error);
        });
    }

    // Update the price of an item in the inventory
    if (goodPrice) {
      fetch(
        `${serverAddress}/db/${dataTable}/changePrice/${updateItemId}/${newPrice}`,
        {
          method: "POST",
        }
      )
        .then(() => {
          setInventory((items) =>
            items.map((item) => {
              if (item.inventory_item_id === parseInt(updateItemId, 10)) {
                return {
                  ...item,
                  price: isNaN(newPrice) || newPrice < 0 ? item.price : newPrice,
                };
              }
              return item;
            })
          );
        })
        .catch((error) => {
          console.error("Error updating price:", error);
        });
    }
    if (goodPrice && goodQuant) {showPopup("Item quantity and price updated successfully!");}
    else if (!goodPrice && goodQuant) {showPopup("Item quantity updated successfully!");}
    else if (goodPrice && !goodQuant) {showPopup("Item price updated successfully!");}
    else {showPopup("Failed to update item. Make sure fields have valid numbers.");}
    clearUpdateItemFields();
  }

  const clearAddItemFields = () => {
    setAddItemName("");
    setAddItemAllergens("");
    setAddItemStock("");
    setAddItemStockUnitType("");
    setAddItemPerishable("");
    setAddItemStorageRequirements("");
    setAddItemPrice("");
  };

  const clearRemoveItemFields = () => {
    setRemoveItemId("");
  };

  const clearUpdateItemFields = () => {
    setUpdateItemId("");
    setUpdateItemQuantity("");
    setUpdateItemPrice("");
  };

  return (
    <div className={styles.inventory}>
      <Header />
      <Popup message={popupMessage} isVisible={isPopupVisible} />
      <h1 className={styles.title}>Ingredient Inventory</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Name</th>
            <th>Allergens</th>
            <th>Stock</th>
            <th>Stock Unit Type</th>
            <th>Order Time</th>
            <th>Perishable</th>
            <th>Storage Requirements</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.inventory_item_id}>
              <td>{item.inventory_item_id}</td>
              <td>{item.name}</td>
              <td>{item.allergens}</td>
              <td>{item.stock}</td>
              <td>{item.stock_unit_type}</td>
              <td>{item.order_time}</td>
              <td>{String(item.perishable)}</td>
              <td>{item.storage_requirements}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Item Section */}
      <h2 className={styles.section}>Add Item</h2>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={addItemName}
          onChange={(e) => setAddItemName(e.target.value)}
        />
        <select
          value={addItemAllergens}
          onChange={(e) => setAddItemAllergens(e.target.value)}
        >
          <option value=""> Select Allergens </option>
          <option value="none"> none </option>
          <option value="milk"> milk </option>
          <option value="nuts"> nuts </option>
        </select>

        <input
          type="number"
          placeholder="Stock"
          value={addItemStock}
          onChange={(e) => setAddItemStock(e.target.value)}
        />

        <select
          value={addItemStockUnitType}
          onChange={(e) => setAddItemStockUnitType(e.target.value)}
        >
          <option value=""> Select Stock Unit Type </option>
          <option value="servings"> servings </option>
          <option value="units"> units </option>
          <option value="cups"> cups </option>
        </select>

        <select
          value={addItemPerishable}
          onChange={(e) => setAddItemPerishable(e.target.value)}
        >
          <option value=""> Is Perishable? </option>
          <option value="t"> perishable </option>
          <option value="f"> not perishable </option>
        </select>

        <select
          value={addItemStorageRequirements}
          onChange={(e) => setAddItemStorageRequirements(e.target.value)}
        >
          <option value=""> Select Storage Requirements </option>
          <option value="none"> none </option>
          <option value="refrigerate"> refrigerate </option>
        </select>

        <input
          type="number"
          placeholder="Price"
          value={addItemPrice}
          onChange={(e) => setAddItemPrice(e.target.value)}
        />

        <button onClick={addInventoryItem} className={styles.button}>
          Add
        </button>
      </div>

      {/* Remove Item Section */}
      <h2 className={styles.section}>Remove Item</h2>
      <div>
        <input
          type="number"
          placeholder="Item ID"
          value={removeItemId}
          onChange={(e) => setRemoveItemId(e.target.value)}
        />
        <button onClick={removeInventoryItem} className={styles.button}>
          Remove
        </button>
      </div>

      {/* Update Item Section */}
      <h2 className={styles.section}>Update Item Quantity and Price</h2>
      <div>
        <input
          type="number"
          placeholder="Enter Item ID"
          value={updateItemId}
          onChange={(e) => setUpdateItemId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter New Quantity"
          value={updateItemQuantity}
          onChange={(e) => setUpdateItemQuantity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter New Price"
          value={updateItemPrice}
          onChange={(e) => setUpdateItemPrice(e.target.value)}
        />
        <button onClick={updateInventoryItem} className={styles.button}>
          Update
        </button>
      </div>
    </div>
  );
}

export default Inventory;
