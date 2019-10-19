var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "clubben.1",
    database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  actionManager();
});

var actionManager = function() {
	inquirer.prompt([
	{
		type: 'list',
		name: 'action',
		message: 'What would you like to do?',
		choices: [
			"View Products for Sale",
			"View Low Inventory",
			"Add to Inventory",
			"Add New Product"
		]
	}
	]).then(function(answer) {
		switch (answer.action) {
		    case "View Products for Sale":
		    	viewProducts();
		      	break;

		    case "View Low Inventory":
		    	viewLowInventory();
		      	break;

		    case "Add to Inventory":
		    	addInventory();
		      	break;

		    case "Add New Product":
		    	addProduct();
		      	break;
		}
	});
};

var viewProducts = function() {
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
		}
		actionManager();
	});
};

var viewLowInventory = function() {
	var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";
	connection.query(query, function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Quantity: " + res[i].stock_quantity);
		}
		actionManager();
	});
};

var addInventory = function() {
	inquirer.prompt([
		{
			name: "productID",
			type: "input",
			message: "Please enter the product ID of the item you would like to add stock to."
		},
		{
			name: "stock",
			type: "input",
			message: "How much stock would you like to add?"
		}
	]).then(function(answer) {
		connection.query("SELECT * FROM products", function(err, results) {
			var chosenItem;

			// Gets product who's stock needs to be updated.
			for (var i = 0; i < results.length; i++) {
				if (results[i].item_id === parseInt(answer.productID)) {
					chosenItem = results[i];
				}
			}
			var updatedStock = parseInt(chosenItem.stock_quantity) + parseInt(answer.stock);

			console.log("Updated stock: " + updatedStock);

			// Updates stock for selected product in database.
			connection.query("UPDATE products SET ? WHERE ?", [{
				stock_quantity: updatedStock
			}, {
				item_id: answer.productID
			}], function (err, res) {
				if (err) {
					throw err;
				} else {
					actionManager();
				}
			});
			
		});

	});
};

var addProduct = function() {
	inquirer.prompt([{
		name: "product_name",
		type: "input",
		message: "Which product you would like to add?"
	}, {
		name: "department_name",
		type: "input",
		message: "Which department is the product in?"
	}, {
		name: "price",
		type: "input",
		message: "What is the price for the product in $?"
	}, {
		name: "stock_quantity",
		type: "input",
		message: "How much stock does the product have?"
	}]).then(function(answer) {
		connection.query("INSERT INTO products SET ?", {
			product_name: answer.product_name,
			department_name: answer.department_name,
			price: answer.price,
			stock_quantity: answer.stock_quantity
		}, function(err, res) {
			if (err) {
				throw err;
			} else {
                console.log("Your product was added successfully!");
            }
            actionManager();
		});
	});
};

