import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the types
interface Drink {
  id: number;
  name: string;
  price: number;
  addons: {name:string, id:number}[];
  sweetness: number;
  ice: string;
}

interface DrinkContextType {
  cart: Drink[];
  addToCart: (drink: Drink) => void;
  removeFromCart: (drinkId: number) => void;
  handleSubmitOrder: (serverAddress: string, orderTotal: number) => Promise<void>;
  updateOrder: (newDrink: Drink) => void;
}

// interface Order {
//   item_id: number;
//   item_name: string;
//   price: number;
//   is_drink: boolean;
// }

interface DrinkProviderProps {
  children: ReactNode;
}



// const [orderItems, setOrderItems] = useState<Order[]>([]);


// Initial state for the cart
const initialState: Drink[] = [];

// Create the context
const DrinkContext = createContext<DrinkContextType | undefined>(undefined);

// Reducer function for managing the cart state
const drinkReducer = (state: Drink[], action: { type: string; payload: Drink | number | null }): Drink[] => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.payload as Drink];
    case 'REMOVE_FROM_CART':
      const drinkId = action.payload as number;
      return state.filter((drink) => drink.id !== drinkId);
    case 'UPDATE_DRINK':
      const updatedDrink = action.payload as Drink;
      return state.map((drink) => (drink.id === updatedDrink.id ? updatedDrink : drink));
      // return [...state, action.payload as Drink];
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

// Provider component
export const DrinkProvider: React.FC<DrinkProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(drinkReducer, initialState);

  // Function to add a drink to the cart
  const addToCart = (drink: Drink): void => {
    console.debug("add to cart drink context", drink.name, drink.id, drink.price, drink.ice, drink.sweetness, drink.addons);
    dispatch({ type: 'ADD_TO_CART', payload: drink });
  };

  const removeFromCart = (drinkId: number): void => {
    console.debug("remove from cart drink context", drinkId)
    dispatch({ type: 'REMOVE_FROM_CART', payload: drinkId });
  };

  const updateOrder = (newDrink: Drink): void => {
    dispatch({ type: 'UPDATE_DRINK', payload: newDrink  });

  }

  // const submitOrder = (drinkId: number): void => { //param is cart
  //   console.debug("remove from cart drink context", drinkId)
  //   dispatch({ type: 'REMOVE_FROM_CART', payload: drinkId });
  // };

  // const handleClearOrder = () => {
  //   setOrderItems([]);
  // };  

  const handleSubmitOrder = async (serverAddress:string, orderTotal: number) => {

      console.log("Length:",cart.length);
      if(cart.length == 0){
        throw new Error('Cart is empty. Cannot submit an empty order.');
      }

      let cartTemp = [...cart];
      console.log("cartTEmp", cartTemp);


      cart.length = 0;
      dispatch({ type: 'CLEAR_CART', payload: null });


      const response1 = await fetch(`${serverAddress}/db/order/add/${orderTotal}`, { method: 'POST' });
  
      if (!response1.ok) {
        console.error('First request failed.');
        return;
      }
      else{
        console.log("first recorded");
      }
  
      const orderResponse = await response1.json(); 
      const next_order_ID = orderResponse.next_order_ID;
      console.log("order num", next_order_ID);
  
      for (const item of cartTemp) {
        const response2 = await fetch(`${serverAddress}/db/order/addDrink/${next_order_ID}/${item.id}`, { method: 'POST' });
        if (!response2.ok) {
          console.error('Second request failed.');
        }
        else{
          console.log("second recorded");
        }
        if(item.addons.length > 0){
          for(const extra of item.addons){
            const response3 = await fetch(`${serverAddress}/db/order/addIngredient/${next_order_ID}/${extra.id}`, { method: 'POST' });
            if (!response3.ok) {
              console.error('Third request failed.');
            }
            else{
              console.log("third recorded");
            }
          }
        }
        if(item.sweetness != 0){
          let sugar = 0;
          if(item.sweetness == 30)
            sugar = 1;
          else if(item.sweetness == 50)
            sugar = 2;
          else if(item.sweetness == 80)
            sugar = 3;
          else if(item.sweetness == 100)
            sugar = 4;
          for(let i = 0; i < sugar; i++){
            const response3 = await fetch(`${serverAddress}/db/order/addIngredient/${next_order_ID}/${35}`, { method: 'POST' });
            if (!response3.ok) {
              console.error('Fourth request failed.');
            }
            else{
              console.log("Fourth recorded");
            }
          }
        }
        if(item.ice != "No ice"){
          let ice = 0;
          if(item.ice == "Less ice")
            ice = 1;
          else if(item.ice == "Regular ice")
            ice = 2;
          for(let i = 0; i < ice; i++){
            const response3 = await fetch(`${serverAddress}/db/order/addIngredient/${next_order_ID}/${52}`, { method: 'POST' });
            if (!response3.ok) {
              console.error('Fifth request failed.');
            }
            else{
              console.log("Fifth recorded");
            }
          }
        }
      }
      
      

      console.log("Array cart ", cart);
      // handleClearOrder();

      // // Clear the success message after a delay (e.g., 2 seconds)
      // setTimeout(() => {
      //   setSuccessMessage(null);
      // }, 1000);
  };

  // Create the context value
  const contextValue: DrinkContextType = { cart, addToCart, removeFromCart, handleSubmitOrder, updateOrder};

  return <DrinkContext.Provider value={contextValue}>{children}</DrinkContext.Provider>;
};

// Hook for using the context
export const useDrinkContext = (): DrinkContextType => {
  const context = useContext(DrinkContext);

  if (!context) {
    throw new Error('useDrinkContext must be used within a DrinkProvider');
  }

  return context;
};