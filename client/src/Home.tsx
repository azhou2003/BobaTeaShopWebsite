import { useState, useEffect, ReactNode, useRef } from "react";
// @ts-ignore
import styles from "./Home.module.css";
// @ts-ignore
import bobaImg from "/src/public/boba_tea.png";
// @ts-ignore
import bobaImgBl from "/src/public/blue_boba_tea.png";
// @ts-ignore
import bobaImgBr from "/src/public/brown_boba_tea.png";
// @ts-ignore
import bobaImgG from "/src/public/grey_boba_tea.png";
// @ts-ignore
import bobaImgO from "/src/public/orange_boba_tea.png";
// @ts-ignore
import bobaImgPe from "/src/public/peach_boba_tea.png";
// @ts-ignore
import bobaImgPi from "/src/public/pink_boba_tea.png";
// @ts-ignore
import bobaImgY from "/src/public/yellow_boba_tea.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useDrinkContext } from "./DrinkContext";
import FontSizeSlider from "./FontSizeSlider";
import setFontSize from "./fontSizeUtility";
// @ts-ignore
import shareTeaTitle from "/src/public/ShareTeaTitle.png";
// import Modal from './Modal';

const imgList = [
  bobaImgPe,
  bobaImgPi,
  bobaImgBl,
  bobaImgY,
  bobaImgBr,
  bobaImgG,
  bobaImg,
  bobaImgO,
];
const serverAddress = "https://shareteaapi.onrender.com";
// const serverAddress = 'http://localhost:8080';

const Modal: React.FC<{ children: ReactNode; onClose: () => void }> = ({
  children,
  onClose,
}) => {
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

const Navbar: React.FC<{
  categories: { category_id: number; category_name: string }[];
  onSelectCategory: (categoryId: number) => void;
}> = ({ categories, onSelectCategory }) => {
  // console.log("categories in navBar");
  // console.log(categories);
  return (
    <nav className={styles.navbar}>
      {categories.map((category) => (
        <button
          className={styles.navButton}
          key={category.category_id}
          onClick={() => onSelectCategory(category.category_id)}
        >
          {category.category_name}
        </button>
      ))}
    </nav>
  );
};

/**
 * A simple React component that creates a header for the home page
 * @component
 *
 * @returns {JSX.Element} React component
 */
const Header = () => {
  const [fontSize, setFontSizeState] = useState<number>(16);
  console.log("font size", fontSize);

  const handleFontSizeChange = (newFontSize: number): void => {
    setFontSizeState(newFontSize);
    setFontSize(newFontSize);
  };

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

  return (
    <div className={styles.header}>
      <div className={styles.left_buttons}>
        {/* Left buttons go here */}
        <ul className={styles.buttonList}>
          {/* <li><h3>Accessibility:</h3></li> */}
          <li>
            <span className={styles.accessTitles}>Text Size</span>
            <FontSizeSlider
              onFontSizeChange={handleFontSizeChange}
            ></FontSizeSlider>
          </li>
          <li>
            <span className={styles.accessTitles}>Language</span>
            <div
              id="google_translate_element"
              className={styles.translateButton}
            ></div>
          </li>
          <Link to="/weather">
            <button className={styles.accessible}>Weather</button>
          </Link>
        </ul>
      </div>
      <div className={styles.title_and_button}>
        <div className={styles.title}>
          <img
            className={styles.titleImg}
            src={shareTeaTitle}
            alt="ShareTea"
          ></img>
        </div>
        <div>
          <div className={styles.customerButtons}>
            <Link
              to="/cart"
              aria-label="Takes the customer to their shopping cart"
            >
              <button
                className={styles.cartButton}
                aria-label="Button for taking the customer to the shopping cart."
              >
                <FontAwesomeIcon
                  className={styles.cartIcon}
                  icon={faCartShopping}
                />
              </button>
            </Link>
            <Link
              to="/display"
              aria-label="Takes the customer to the full menu"
            >
              <button
                className={styles.menuButton}
                aria-label="Button for taking the customer to the full menu"
              >
                <FontAwesomeIcon className={styles.menuIcon} icon={faList} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <ul className={styles.buttonList}>
        <li>
          <Link to="/login">
            <button className={styles.links}>Login</button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

/**
 * A simple React component that handles the functionality for the current category based on what is selected in the navbar
 * @component
 *
 * @param {any} category holds types of drinks in category
 * @param {any} catId ID of category in database
 * @param {any} selectedCategory Name of selected category
 * @param {any} toppingList List of toppings from database
 * @returns {JSX.Element} React component
 */
const Category = ({ category, catId, selectedCategory, toppingList }: any) => {
  const { addToCart } = useDrinkContext();
  const [drinksList, setDrinks] = useState<any[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<
    { name: string; id: number }[]
  >([]);
  const [toggleButtons] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDrinkDetails, setSelectedDrinkDetails] = useState<any>(null);

  const handleToggleTopping = (topping: { name: string; id: number }) => {
    // Toggle the topping in the selectedToppings array
    if (selectedToppings.some((selected) => selected.id === topping.id)) {
      setSelectedToppings(
        selectedToppings.filter((selected) => selected.id !== topping.id)
      );
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
    console.log("Selected Toppings:", selectedToppings);
  };

  useEffect(() => {
    // Only fetch drinks if the category is selected
    if (selectedCategory === catId) {
      fetch(`${serverAddress}/db/drinks/${catId}`)
        .then((response) => response.json())
        .then((drinksList) => {
          setDrinks(drinksList);
          console.log(drinksList);
        })
        .catch((error) => {
          console.error("Error fetching drinks:", error);
        });
    }
    setSelectedDrink(null);
  }, [catId, selectedCategory]);

  useEffect(() => {
    if (showDetailsModal && selectedDrinkDetails) {
      const fetchIngredients = async () => {
        try {
          const response1 = await fetch(
            `${serverAddress}/db/drink/getIngredients/${selectedDrinkDetails.id}`,
            { method: "POST" }
          );

          if (!response1.ok) {
            console.error("First request failed.");
            return;
          }

          const drinkIngredients = await response1.json();
          // console.log("details",drinkIngredients);
          // Update the selectedDrinkDetails with the fetched ingredients
          setSelectedDrinkDetails({
            ...selectedDrinkDetails,
            ingredients: drinkIngredients,
          });
        } catch (error) {
          console.error("Error fetching drink ingredients:", error);
        }
      };

      fetchIngredients();
    }
  }, [showDetailsModal, selectedDrinkDetails]);

  // Render only if the category is selected
  if (selectedCategory !== catId) {
    return null;
  }

  const handleAddToCart = () => {
    console.log("Add to Cart", selectedDrink.name, selectedDrink.addons);
    if (selectedDrink) {
      addToCart({
        ...selectedDrink,
        addons: selectedToppings,
        sweetness: selectedDrink.sweetness,
        ice: selectedDrink.ice,
      });
      setShowModal(false);
      setSelectedToppings([]); // Clear selected toppings after adding to cart
    }
  };

  const excludedIds = [1, 2, 3, 4, 5];

  return (
    <div className={styles.category}>
      <h1 className={styles.home_h1}>{category}</h1>
      <div className={styles.drink_panel_container}>
        {drinksList.map((drink: any, index: any) => (
          <div className={styles.drink_panel} key={index}>
            <h3>{drink.at(3)}</h3>
            <img
              className={styles.home_img}
              src={imgList[catId - 1]}
              alt={drink.at(3)}
            />
            <br></br>
            <button
              className={styles.addCartBtn}
              onClick={() => {
                setSelectedDrink({
                  id: drink.at(0),
                  name: drink.at(3),
                  price: drink.at(2),
                  addons: [],
                  sweetness: 100,
                  ice: "Regular ice",
                });
                setShowModal(true);
              }}
            >
              Add To Cart
            </button>
            <div className={styles.button_separator}></div>
            <button
              className={styles.addCartBtn}
              onClick={() => {
                setSelectedDrinkDetails({
                  id: drink.at(0),
                  name: drink.at(3),
                  price: drink.at(2),
                  addons: [], // Add any other details you want to show
                  sweetness: 100,
                  ice: "Regular ice",
                });
                setShowDetailsModal(true);
              }}
            >
              Details
            </button>
          </div>
        ))}
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>{selectedDrink?.name}</h2>
          <label>
            <div>
              <h3 className={styles.h3Topping}>Sweetness:</h3>
            </div>
            <select
              className={styles.selectDrop}
              value={selectedDrink?.sweetness}
              onChange={(e) =>
                setSelectedDrink({
                  ...selectedDrink,
                  sweetness: parseInt(e.target.value, 10),
                })
              }
            >
              <option value={100}>100%</option>
              <option value={80}>80%</option>
              <option value={50}>50%</option>
              <option value={30}>30%</option>
              <option value={0}>0%</option>
            </select>
          </label>
          <label>
            <div>
              <h3 className={styles.h3Topping}>Ice:</h3>
            </div>
            <select
              className={styles.selectDrop}
              value={selectedDrink?.ice}
              onChange={(e) =>
                setSelectedDrink({ ...selectedDrink, ice: e.target.value })
              }
            >
              <option value="Regular ice">Regular ice</option>
              <option value="Less ice">Less ice</option>
              <option value="No ice">No ice</option>
            </select>
          </label>
          {toggleButtons && (
            <div>
              <h3>Toppings:</h3>
              {/* Toggle buttons for toppings */}
              <div className={styles.toppingsContainer}>
                {toppingList.map((topping: { name: string; id: number }) => (
                  <button
                    key={topping.id}
                    className={
                      selectedToppings.some(
                        (selected) => selected.id === topping.id
                      )
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
          <button className={styles.addCartBtnModal} onClick={handleAddToCart}>
            Add to Cart
          </button>
        </Modal>
      )}
      {showDetailsModal && (
        <Modal onClose={() => setShowDetailsModal(false)}>
          <h2>{selectedDrinkDetails?.name}</h2>
          {selectedDrinkDetails?.ingredients && (
            <div className={styles.ingredientsContainer}>
              <div className={styles.ingredientsList}>
                <h3>Ingredients:</h3>
                <ul>
                  {selectedDrinkDetails.ingredients.map(
                    (ingredient: any) =>
                      // Exclude items with IDs present in the excludedIds array
                      !excludedIds.includes(ingredient.inventory_item_id) && (
                        <li
                          className={styles.ingredientItems}
                          key={ingredient.inventory_item_id}
                        >
                          {ingredient.name}
                        </li>
                      )
                  )}
                </ul>
              </div>
              <div className={styles.ingredientsList}>
                <h3>Allergens:</h3>
                <ul>
                  {selectedDrinkDetails.ingredients.map((ingredient: any) => {
                    // Display different allergens based on conditions
                    let allergenName = null;
                    if (
                      ingredient.inventory_item_id === 8 ||
                      ingredient.inventory_item_id === 9 ||
                      ingredient.inventory_item_id === 15 ||
                      ingredient.inventory_item_id === 17
                    ) {
                      allergenName = "Milk";
                    } else if (ingredient.inventory_item_id === 14) {
                      allergenName = "Tree nuts";
                    } else if (ingredient.inventory_item_id === 24) {
                      allergenName = "Mango";
                    } else if (ingredient.inventory_item_id === 27) {
                      allergenName = "Soy beans";
                    } else if (ingredient.inventory_item_id === 47) {
                      allergenName = "Gluten/Malt";
                    } else if (ingredient.inventory_item_id === 53) {
                      allergenName = "Coconut";
                    }

                    // Check if allergenName is not null
                    if (allergenName) {
                      return (
                        <li
                          className={styles.ingredientItems}
                          key={ingredient.inventory_item_id}
                        >
                          {allergenName}
                        </li>
                      );
                    }

                    return null; // Return null for cases where no allergen is displayed
                  })}
                </ul>
              </div>
            </div>
          )}
          {/* Render other details here, e.g., price, addons, sweetness, ice */}
          {/* <button onClick={() => setShowDetailsModal(false)}>Close</button> */}
        </Modal>
      )}
    </div>
  );
};

/**
 * A React component that creates the home page
 * @component
 *
 * @returns {JSX.Element} React component
 */
function Home() {
  const [data, setData] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    document.body.classList.add(styles.home_body);

    fetch(`${serverAddress}/db/categories`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);

        // Set the first category as the default selected category
        if (data.length > 0) {
          setSelectedCategory(data[0].category_id);
        }

        console.log("categories: ");
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => {
      document.body.classList.remove(styles.home_body);
    };
  }, []);

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className={styles.home}>
      <Header />
      <Navbar categories={data} onSelectCategory={handleSelectCategory} />
      <br />
      <div className={styles.category_container}>
        {data.map((categoryData, index) => (
          <Category
            key={index}
            category={categoryData.category_name}
            catId={categoryData.category_id}
            onSelectCategory={() =>
              setSelectedCategory(categoryData.category_id)
            }
            selectedCategory={selectedCategory}
            toppingList={[
              { name: "Pearl", id: 6 },
              { name: "Mini Pearl", id: 7 },
              { name: "Ice Cream", id: 8 },
              { name: "Pudding", id: 9 },
              { name: "Aloe Vera", id: 10 },
              { name: "Red Bean", id: 11 },
              { name: "Herb Jelly", id: 12 },
              { name: "Aiyu Jelly", id: 13 },
              { name: "Lychee Jelly", id: 14 },
              { name: "Creama", id: 15 },
              { name: "Crystal Boba", id: 16 },
            ]}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
