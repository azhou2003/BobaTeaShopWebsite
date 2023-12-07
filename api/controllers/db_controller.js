const db_controller = {};


/**
 * A query that returns drinks sorted by drink_id
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/drinks, { method: 'GET' });
 * @returns {res.json} Array rows containing drinks with their attributes
 */
db_controller.getDrinks = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Define the SQL query to select all entries from the "drinks" table
        const query = 'SELECT * FROM drinks ORDER BY drink_id';

        // Use the connection pool to execute the query
        const result = await pool.query(query);

        // Send the retrieved data to the frontend
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * A query that returns drinks sorted by category_id
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/drink/sortCategories, { method: 'GET' });
 * @returns {res.json} Array rows containing drinks with their attributes
 * 
 */
db_controller.getDrinksSortCat = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Define the SQL query to select all entries from the "drinks" table
        const query = 'SELECT * FROM drinks ORDER BY category_id';

        // Use the connection pool to execute the query
        const result = await pool.query(query);

        // Send the retrieved data to the frontend
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * A query that returns the catagories in the database
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/categories, { method: 'GET' });
 *
 * @returns {res.json} Array rows containing Categories with their attributes
 */
db_controller.getCategories = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // SQL query to select all entries from the "categories" table
        const query = 'SELECT * FROM categories ORDER BY category_id';

        // Use the connection pool to execute the query
        const result = await pool.query(query);

        // Send the retrieved data to the frontend
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * A query that returns the inventory in the database
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/inventory, { method: 'GET' });
 *
 * @returns {res.json} Array containing inventory items with their attributes
 */
db_controller.getInventory = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // SQL query to select all entries from the "categories" table
        const query = 'SELECT * FROM Inventory_Item ORDER BY Inventory_item_id';

        // Use the connection pool to execute the query
        const result = await pool.query(query);

        // Send the retrieved data to the frontend
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * A query that returns the drinks in a given category in the database
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/drinks/${1}, { method: 'GET' });
 *
 * @param {int} props - category id
 * @returns {res.json} Array containing drinks with their attributes
 */
db_controller.getDrinksFromCategory = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the category_id from the request parameters
        const category_id = req.params.category_id;

        // SQL query to select all entries from the "categories" table
        const query = 'SELECT * FROM drinks WHERE category_id = $1';

        // Use the connection pool to execute the query
        const result = await pool.query(query, [category_id]);

        const formattedData = result.rows.map(row => {
            return [row.drink_id, row.category_id, row.price, row.drink_name]; // Replace with actual property names
        });

        // Send the retrieved data to the frontend
        res.json(formattedData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

db_controller.getDrinksFromCat = async (req, res) => { //Alternate function
    try {
        const pool = req.app.get('pool');

        // Get the category_id from the request parameters
        const category_id = req.params.category_id;

        // SQL query to select all entries from the "categories" table
        const query = 'SELECT * FROM drinks WHERE category_id = $1';

        // Use the connection pool to execute the query
        const result = await pool.query(query, [category_id]);

        // Send the retrieved data to the frontend
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * A query that adds a drink to the database
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/drinks/add/${1}/${"test drink"}/${1.5}, { method: 'POST' });
 *
 * @param {int} category_id - category id
 * @param {string} drink_name - drink name
 * @param {double} price - price
 * @returns {res.json} Array containing drinks with their attributes
 */
db_controller.addDrink = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const category_id = req.params.category_id;
        const drink_name = req.params.drink_name;
        const price = req.params.price;

        // SQL query to get the next primary key
        const query1 = 'SELECT COALESCE(MAX(drink_id), 0) + 1 AS next_id FROM drinks';
        const result1 = await pool.query(query1);
        const next_drink_ID = result1.rows[0].next_id;

        // Use the received drink_id to add a drink to the database
        const query2 = "INSERT INTO drinks (drink_id, category_id, price, drink_name) VALUES ($1, $2, $3, $4)";
        const result2 = await pool.query(query2, [next_drink_ID, category_id, price, drink_name]);

        res.send('Drink added successfully'); // Send a response back to the client
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * A query that removes a drink from the database
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/drinks/remove/${1}, { method: 'POST' });
 *
 * @param {int} drink_id - drink id
 * @returns {string} string that says if it was successful
 */
db_controller.removeDrink = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const drink_id = req.params.drink_id;

        // SQL query to remove the drink
        const query1 = 'DELETE FROM drinks WHERE drink_id = $1';
        const result1 = await pool.query(query1, [drink_id]);

        // query to remove that drink's relationships
        const query2 = "DELETE FROM drinks_and_ingredients WHERE drink_id = $1";
        const result2 = await pool.query(query2, [drink_id]);


        res.send('Drink removed successfully'); // Send a response back to the client
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * A query that adds an order to the database
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/order/add/${12.5}, { method: 'POST' });
 *
 * @param {double} total - total cost of order
 * @returns {string} string that says if it was successful
 */
db_controller.addOrder = async (req, res) => {
    try {
        const pool = req.app.get('pool');
        const total = req.params.total;

        const query1 = 'SELECT COALESCE(MAX(order_id), 0) + 1 AS next_id FROM orders';
        const result1 = await pool.query(query1);
        const next_order_ID = result1.rows[0].next_id;

        const current_datetime = new Date();
        const current_date = current_datetime.getFullYear() + '-' + (current_datetime.getMonth() + 1).toString().padStart(2, '0') + '-' + current_datetime.getDate().toString().padStart(2, '0');
        const current_time = current_datetime.toTimeString().split(' ')[0];

        const query2 = "INSERT INTO orders (order_id, total, date, time) VALUES ($1, $2, $3, $4)";
        const result2 = await pool.query(query2, [next_order_ID, total, current_date, current_time]);

        res.status(201).json({ message: 'Order added successfully', next_order_ID: next_order_ID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * A query that changes the stock of an inventory item
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/inventory/changeStock/${1}/${50}, { method: 'POST' });
 *
 * @param {int} inventory_item_id - inventory item id
 * @param {int} stock_change - change in inventory stock (positive or negative)
 * @returns {string} string that says if it was successful
 */
db_controller.changeInventoryStock = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const inventory_item_id = req.params.inventory_item_id;
        const stock_change = req.params.stock_change;

        await changeInventoryStock(pool, inventory_item_id, stock_change);

        res.send('Stock changed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * A helper function query that changes the stock of an inventory item
 * @component
 *
 * @example
 * // Usage:
 * changeInventoryStock(pool, inventory_item_id, stock_change);
 *
 * @param {pool} pool - pool for the function
 * @param {int} inventory_item_id - inventory item id
 * @param {int} stock_change - change in inventory stock (positive or negative)
 * @returns {int} 0 if successful -1 if error
 */
const changeInventoryStock = async (pool, inventory_item_id, stock_change) => {
    try {
        // get current stock amount
        const query1 = "SELECT stock FROM inventory_item WHERE inventory_item_id = $1";
        const result1 = await pool.query(query1, [inventory_item_id]);
        const current_stock = result1.rows[0].stock;

        // Calculate the updated stock with the stock_change
        const updated_stock = current_stock + parseInt(stock_change);

        // Get and format current date
        const current_datetime = new Date();
        const current_date = current_datetime.getFullYear() + '-' + (current_datetime.getMonth() + 1).toString().padStart(2, '0') + '-' + current_datetime.getDate().toString().padStart(2, '0'); // Format: YYYY-MM-DD

        // update stock value and restock date
        const query2 = "UPDATE inventory_item SET stock = $1, order_time = $2 WHERE inventory_item_id = $3";
        const result2 = await pool.query(query2, [updated_stock, current_date, inventory_item_id])

        return 0;
    }
    catch (error) {
        console.error(error);
        return -1;
    }
};

/**
 * A query that adds a drink to an order in the database
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/order/addDrink/${15}/${4}, { method: 'POST' });
 *
 * @param {int} order_id - order id
 * @param {int} drink_id - drink to add to the order
 * @returns {string} string that says if it was successful
 */
db_controller.addOrderDrink = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const order_id = req.params.order_id;
        const drink_id = req.params.drink_id;

        // query for the next primary key
        const query1 = 'SELECT COALESCE(MAX(relationship_id), 0) + 1 AS next_id FROM order_to_drink';
        const result1 = await pool.query(query1);
        const next_order_ID = result1.rows[0].next_id;

        // query for adding an order
        const query2 = "INSERT INTO order_to_drink (relationship_id, order_id, drink_id) VALUES ($1, $2, $3)";
        const result2 = await pool.query(query2, [next_order_ID, order_id, drink_id]);

        // Update stock in inventory
        const query3 = "SELECT inventory_item_id FROM drinks_and_ingredients WHERE drink_id = $1";
        const result3 = await pool.query(query3, [drink_id]);

        // call update stock on all ingredients in the drink
        for (const row of result3.rows) {
            const inventory_item_id = row.inventory_item_id;
            // use normal function call and not request
            await changeInventoryStock(pool, inventory_item_id, -1);
        }

        res.send('Drink added to order successfully');

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * A query that checks username and passwords in the database
 * @component
 *
 * @example
 * // Usage:
 * fetch(${serverAddress}/db/login/${'username'}/${'password'}, { method: 'GET' });
 *
 * @param {string} username - username to check
 * @param {string} password - password to check
 * @returns {string} string that says if it was successful
 */
db_controller.verifyLogin = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const username = req.params.username;
        const password = req.params.password;

        // query for usernames
        const query1 = "SELECT * FROM username WHERE username = $1";
        const result1 = await pool.query(query1, [username]);

        // Invalid username check
        if (result1.rows.length === 0) {
            res.send("Invalid login");
            return;
        }
        const valid_username = result1.rows[0].user_id;
        const is_manager = result1.rows[0].is_manager;

        // if valid username query
        // query for passwords
        const query2 = "SELECT user_id FROM Password WHERE password = $1";
        const result2 = await pool.query(query2, [password]);

        // Incorrect password check
        if (result2.rows.length === 0 || result2.rows[0].user_id !== valid_username) {
            res.send("Invalid login");
            return;
        }


        const password_user = result2.rows[0].user_id;

        if (valid_username == password_user) {
            // correct username and password, return based on manager status
            if (is_manager) {
                res.send("Manager login");
            }
            else {
                res.send("Cashier login");
            }
        }
        else {
            res.send("Invalid login");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/** A query that adds extra ingredients to an order
* @component
*
* @example
* // Usage:
* fetch(${serverAddress}/db/order/addIngredient/${2}/${3}}, { method: 'POST' });
*
* @param {int} order_id - order id
* @param {int} ingredient_id - ingredient to add to order
* @returns {string} string that says if it was successful
*/
db_controller.addOrderIngredients = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const order_id = req.params.order_id;
        const ingredient_id = req.params.ingredient_id;

        // get the next primary key
        const query1 = "SELECT COALESCE(MAX(relationship_id), 0) + 1 AS next_id FROM order_to_ingredient";
        const result1 = await pool.query(query1);
        const next_relationship_id = result1.rows[0].next_id;

        // Insert into order_to_ingredient with the calculated relationship_id
        const query2 = "INSERT INTO order_to_ingredient (relationship_id, order_id, ingredient_id) VALUES ($1, $2, $3)";
        const result2 = await pool.query(query2, [next_relationship_id, order_id, ingredient_id]);

        // Update stock on the ingredient used
        // use normal function call and not request
        await changeInventoryStock(pool, ingredient_id, -1);

        res.send('Ingredient added to order successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/** A query that adds an ingredients relationship to a drink
* @component
*
* @example
* // Usage:
* fetch(${serverAddress}/db/drink/addIngredient/${1}/${1}, { method: 'POST' });
*
* @param {int} drink_id - drink id
* @param {int} inventory_item_id - ingredient to add to order
* @returns {string} string that says if it was successful
*/
db_controller.addDrinkIngredient = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const drink_id = req.params.drink_id;
        const inventory_item_id = req.params.inventory_item_id;

        // Get next primary key
        const query1 = "SELECT COALESCE(MAX(relationship_id), 0) + 1 AS next_id FROM drinks_and_ingredients";
        const result1 = await pool.query(query1);
        const next_relationship_id = result1.rows[0].next_id;

        // query to add item
        const query2 = "INSERT INTO drinks_and_ingredients (relationship_id, drink_id, inventory_item_id, quantity) VALUES ($1, $2, $3, $4)";
        const result2 = await pool.query(query2, [next_relationship_id, drink_id, inventory_item_id, 1]); // quanitiy is 1 until further notice

        res.send("Drink Ingredient added successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/** A query that changes a drink's price
* @component
*
* @example
* // Usage:
* fetch(${serverAddress}/db/drink/changePrice/${1}/${1.2}, { method: 'POST' });
*
* @param {int} drink_id - drink id
* @param {double} new_price - new price to change the drink's price to
* @returns {string} string that says if it was successful
*/
db_controller.changeDrinkPrice = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const drink_id = req.params.drink_id;
        const new_price = req.params.new_price;

        // query to change the price of a drink
        const query1 = "UPDATE drinks SET price = $1 WHERE drink_id = $2";
        const result1 = pool.query(query1, [new_price, drink_id]);

        res.send("Price updated successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/** A query that changes an inventory item's price
* @component
*
* @example
* // Usage:
* fetch(${serverAddress}/db/inventory/changePrice/:inventory_item_id/:new_price, { method: 'POST' });
*
* @param {int} inventory_item_id - inventory item id
* @param {double} new_price - new price to change the item's price to
* @returns {string} string that says if it was successful
*/
db_controller.changeInventoryPrice = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const inventory_item_id = req.params.inventory_item_id;
        const new_price = req.params.new_price;

        // query to change the price
        const query1 = "UPDATE inventory_item SET price = $1 WHERE inventory_item_id = $2";
        const result1 = pool.query(query1, [new_price, inventory_item_id]);

        res.send("Price updated successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/** A query that adds an item to the inventory item table in the database
* @component
*
* @example
* // Usage:
* fetch(${serverAddress}/db/inventory/addItem/:name/:allergens/:stock/:stock_unit_type/:perishable/:storage_requirements/:price, { method: 'POST' });
*
* @param {string} name - name of the item
* @param {string} allergens - allergens the item may have
* @param {int} stock - initial stock of the item
* @param {string} stock_unit_type - unit the stock in measured in
* @param {boolean} perishable - if the item is perishable or not
* @param {string} storage_requirements - if the item has any special storage requirements
* @param {double} price - the item's price
* @returns {string} string that says if it was successful
*/
db_controller.addInventoryItem = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const name = req.params.name;
        const allergens = req.params.allergens;
        const stock = req.params.stock;
        const stock_unit_type = req.params.stock_unit_type;
        const perishable = req.params.perishable;
        const storage_requirements = req.params.storage_requirements;
        const price = req.params.price;

        // Get next primary key
        const query1 = "SELECT COALESCE(MAX(inventory_item_id), 0) + 1 AS next_id FROM inventory_item";
        const result1 = await pool.query(query1);
        const next_relationship_id = result1.rows[0].next_id;

        // get current date
        const current_datetime = new Date();
        const current_date = current_datetime.getFullYear() + '-' + (current_datetime.getMonth() + 1).toString().padStart(2, '0') + '-' + current_datetime.getDate().toString().padStart(2, '0');

        // query to add item
        const query2 = "INSERT INTO inventory_item (inventory_item_id, name, allergens, stock, stock_unit_type, order_time, perishable, storage_requirements, price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
        const result2 = await pool.query(query2, [next_relationship_id, name, allergens, stock, stock_unit_type, current_date, perishable, storage_requirements, price]);

        res.send("Item added successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/** A query that removes an item from the inventory
* @component
*
* @example
* // Usage:
* fetch(${serverAddress}/db/inventory/remove/${1}, { method: 'POST' });
*
* @param {int} inventory_item_id - id of the inventory item
* @returns {string} string that says if it was successful
*/
db_controller.removeInventoryItem = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const inventory_item_id = req.params.inventory_item_id;

        // query to remove item
        const query1 = "DELETE FROM inventory_item WHERE inventory_item_id = $1";
        const result1 = await pool.query(query1, [inventory_item_id]);

        res.send("Item removed successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/** A query that returns the ingredients of a specific drink
* @component
*
* @example
* // Usage:
* fetch(${serverAddress}/db/drink/getIngredients/${3}, { method: 'POST' });
*
* @param {int} drink_id - id of the drink
* @returns {res.json} Array rows containing ingredients with their attributes
*/
db_controller.getDrinkIngredients = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        // Get the parameters from the request parameters
        const drink_id = req.params.drink_id;

        // query to get ingredients used in the drink 
        const query1 = "SELECT * FROM drinks_and_ingredients WHERE drink_id = $1 ORDER BY inventory_item_id";
        const result1 = await pool.query(query1, [drink_id]);

        if (result1.rows.length === 0) {
            res.send("Invalid Drink");
        }
        else {
            // Extract inventory_item_id values from the first query results
            const inventoryItemIds = result1.rows.map(row => row.inventory_item_id);

            // Query to get details for each inventory_item_id
            const query2 = "SELECT * FROM inventory_item WHERE inventory_item_id = ANY($1) ORDER BY inventory_item_id";
            const result2 = await pool.query(query2, [inventoryItemIds]);

            res.send(result2.rows);
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/** A query that returns the ingredients used over a period of time
* @component
*
* @example
* // Usage:
* fetch(${serverAddress}/db/report/ingredients/:startdate/:enddate, { method: 'GET' });
*
* @param {string} startdate - start date in format MM:DD:YYY
* @param {string} startdate - end date in format MM:DD:YYY
* @returns {res.json} Array rows containing ingredients and amounts
*/
db_controller.ingredientCount = async (req, res) => {
    try {
        const pool = req.app.get('pool');
        const { startdate, enddate } = req.params;

        // Convert startdate and enddate to JavaScript Date objects
        const startDate = new Date(startdate);
        const endDate = new Date(enddate);

        // Initialize ingredient_counts as an empty Map
        const ingredient_counts = new Map();

        // First query
        const orderIngredientSql = `SELECT oti.ingredient_id, COUNT(oti.order_id) AS order_count
                                    FROM order_to_ingredient oti
                                    WHERE oti.order_id IN (SELECT o.order_id FROM orders o WHERE o.date >= $1 AND o.date <= $2)
                                    GROUP BY oti.ingredient_id`;

        const orderIngredientResults = await pool.query(orderIngredientSql, [startDate, endDate]);

        orderIngredientResults.rows.forEach(row => {
            const ingredientId = row.ingredient_id;
            const orderCount = row.order_count;
            ingredient_counts.set(ingredientId, (ingredient_counts.get(ingredientId) || 0) + orderCount);
        });

        // Second query
        const drinkIngredientSql = `SELECT inventory_item_id, SUM(1) AS total_amount
                                    FROM orders o
                                    JOIN order_to_drink otd ON o.order_id = otd.order_id
                                    JOIN drinks_and_ingredients dai ON otd.drink_id = dai.drink_id
                                    WHERE o.date >= $1 AND o.date <= $2
                                    GROUP BY inventory_item_id`;

        const drinkIngredientResults = await pool.query(drinkIngredientSql, [startDate, endDate]);

        drinkIngredientResults.rows.forEach(row => {
            const ingredientId = row.inventory_item_id;
            const totalAmount = row.total_amount;
            ingredient_counts.set(ingredientId, (ingredient_counts.get(ingredientId) || 0) + totalAmount);
        });

        res.json(Array.from(ingredient_counts.entries()));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/** A query that returns the ingredients used over a period of time
* @component
*
* @example
* // Usage:
* fetch(${serverAddress}/db/report/ingredients/:startdate/:enddate, { method: 'GET' });
*
* @param {string} startdate - start date in format MM:DD:YYY
* @param {string} startdate - end date in format MM:DD:YYY
* @returns {res.json} Array containing ingredients and amounts
*/
db_controller.salesReport = async (req, res) => {
    try {
        const pool = req.app.get('pool');

        const { startdate, enddate, drinkid } = req.params;

        // Convert startdate and enddate to JavaScript Date objects
        const startDate = new Date(startdate);
        const endDate = new Date(enddate);

        const query = `SELECT o.date AS order_date, COUNT(otd.order_id) AS orders_count
                        FROM orders o
                        JOIN order_to_drink otd ON o.order_id = otd.order_id
                        WHERE o.date >= $1 AND o.date <= $2
                        AND otd.drink_id = $3
                        GROUP BY o.date
                        ORDER BY o.date`;

        const results = await pool.query(query, [startDate, endDate, drinkid]);

        const dateToSales = results.rows.reduce((map, row) => {
            const orderDate = row.order_date.toISOString().split('T')[0];
            map[orderDate] = row.orders_count;
            return map;
        }, {});

        res.json(dateToSales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/** A query that returns a list of the items that were bought together the most limit 200
* @component
*
* @example
* // Usage:
* fetch(${serverAddress}/db/report/pair/:startdate/:enddate, { method: 'GET' });
*
* @param {string} startdate - start date in format MM:DD:YYY
* @param {string} startdate - end date in format MM:DD:YYY
* @returns {res.json} Array rows containing drinks and combination totals
*/
db_controller.boughtTogether = async (req, res) => {
    try {
        const pool = req.app.get('pool');
        const { startdate, enddate } = req.params;

        // Convert startdate and enddate to JavaScript Date objects
        const startDate = new Date(startdate);
        const endDate = new Date(enddate);

        const pstmt1 =
            "SELECT d1.drink_id AS drink_id1, d2.drink_id AS drink_id2, COUNT(*) as count " +
            "FROM orders o " +
            "JOIN order_to_drink od1 ON o.order_id = od1.order_id " +
            "JOIN order_to_drink od2 ON o.order_id = od2.order_id " +
            "JOIN drinks d1 ON od1.drink_id = d1.drink_id " +
            "JOIN drinks d2 ON od2.drink_id = d2.drink_id " +
            "WHERE o.date BETWEEN $1 AND $2 " +
            "AND od1.drink_id < od2.drink_id " +
            "GROUP BY d1.drink_id, d2.drink_id " +
            "ORDER BY count DESC " +
            "LIMIT 200;";

        const result = await pool.query(pstmt1, [startDate, endDate]);

        const answer = [];
        for (const row of result.rows) {
            const drink_id1 = row.drink_id1;
            const drink_id2 = row.drink_id2;
            const count = row.count;

            if (drink_id1 > 0 && drink_id2 > 0 && count > 0) {
                const pstmt2 = "SELECT drink_name FROM drinks WHERE drink_id = $1 OR drink_id = $2;";
                const result2 = await pool.query(pstmt2, [drink_id1, drink_id2]);

                const drink_name1 = result2.rows[0].drink_name;
                const drink_name2 = result2.rows[1].drink_name;

                const entry = [count.toString(), drink_name1, drink_name2];
                answer.push(entry);
            } else {
                const entry = ['error', '', ''];
                answer.push(entry);
            }
        }

        res.json(answer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

db_controller.restockTable = async (req, res) => {
    try {
        const pool = req.app.get('pool');
        const findRestockItemsQuery = "SELECT * from inventory_item";
        const findRestockItemsResult = await pool.query(findRestockItemsQuery);

        const restockItems = [];

        for (const row of findRestockItemsResult.rows) {
            const nextItemStock = row.stock;

            if (nextItemStock < 100) {
                const nextItemName = row.name;
                const nextItemId = row.inventory_item_id;

                const nextItem = [nextItemId.toString(), nextItemName, nextItemStock.toString()];
                restockItems.push(nextItem);
            }
        }

        res.json(restockItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = db_controller;