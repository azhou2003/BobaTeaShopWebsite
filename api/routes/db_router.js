// Import Modules
const express = require('express');
const router = express.Router();
const db_controller = require('../controllers/db_controller');

// Define Routes
router.get('/drinks', db_controller.getDrinks);
router.get('/categories', db_controller.getCategories);
router.get('/inventory', db_controller.getInventory)
router.post('/drinks/add/:category_id/:drink_name/:price', db_controller.addDrink);
router.post('/drinks/remove/:drink_id', db_controller.removeDrink);
router.post('/drink/addIngredient/:drink_id/:inventory_item_id', db_controller.addDrinkIngredient);
router.post('/drink/changePrice/:drink_id/:new_price', db_controller.changeDrinkPrice);
router.post('/inventory/addItem/:name/:allergens/:stock/:stock_unit_type/:perishable/:storage_requirements/:price', db_controller.addInventoryItem);
router.post('/inventory/remove/:inventory_item_id', db_controller.removeInventoryItem);
router.post('/inventory/changeStock/:inventory_item_id/:stock_change', db_controller.changeInventoryStock);
router.post('/inventory/changePrice/:inventory_item_id/:new_price', db_controller.changeInventoryPrice);
router.get('/drinks/:category_id', db_controller.getDrinksFromCategory); 
router.get('/drinks2/:category_id', db_controller.getDrinksFromCat); 
router.post('/order/add/:total', db_controller.addOrder);
router.post('/order/addDrink/:order_id/:drink_id', db_controller.addOrderDrink);
router.post('/order/addIngredient/:order_id/:ingredient_id', db_controller.addOrderIngredients);
router.get('/login/:username/:password', db_controller.verifyLogin);

router.post('/drink/getIngredients/:drink_id', db_controller.getDrinkIngredients);

// IF TIME PERMITS
// restock table 
router.get('/report/restockTable', db_controller.restockTable); //example: http://localhost:8080/db/report/restockTable
// get ingredient counts
router.get('/report/ingredients/:startdate/:enddate', db_controller.ingredientCount); //example: http://localhost:8080/db/report/ingredients/2023-11-01/2023-12-01
// get sales report
router.get('/report/sales/:startdate/:enddate/:drinkid', db_controller.salesReport); //example: http://localhost:8080/db/report/sales/2023-01-01/2023-12-31/1
// get most bought together
router.get('/report/pair/:startdate/:enddate', db_controller.boughtTogether) //example: http://localhost:8080/db/report/pair/2023-10-01/2023-11-01
// get all drinks sorted by categories
router.get('/drink/sortCategories', db_controller.getDrinksSortCat);


// Error handling 
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = router;