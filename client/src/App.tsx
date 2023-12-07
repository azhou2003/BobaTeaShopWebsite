import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Cashier from './Cashier';
import Inventory from './Inventory';
import Menu from './Menu';
import Cart from './Cart';
import { DrinkProvider } from './DrinkContext';
import Display from './Display';
import Weather from './Weather';
import Reports from './Reports';

function App() {
  return (
    <Router>
      <DrinkProvider>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Default page */}
          <Route path="/login" element={<Login />} /> 
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/display" element={<Display />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </DrinkProvider>
    </Router>
  );
}

export default App;
