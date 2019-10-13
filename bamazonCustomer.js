var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "clubben.1",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    queryAllProducts();
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | $" + res[i].price)
        }
        console.log("----------------------------------------------------");
    });
}

function makeOrder() {
    inquirer.prompt([
        {
            name: "itemId",
            type: "input",
            message: "What is the ID of the product you would like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "itemAmount",
            type: "input",
            message: "How many untis of the product would you like to buy?",
            validate: function (value) {
                if (isNAN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then
}

