var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
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
            console.log(res[i].item_id + " || " + res[i].product_name + " || $" + res[i].price)
        }
        console.log("----------------------------------------------------");
        makeOrder();
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
            message: "How many units of the product would you like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            connection.query("SELECT stock_quantity,price FROM products WHERE ?", { item_id: answer.itemId }, function (err, res) {
                if (err) throw err;
                if (res[0].stock_quantity < answer.itemAmount) {
                    console.log("Insufficient quantity! Please chose a different item.\n");
                    inquirer.prompt({
                        name: "proceed",
                        type: "confirm",
                        message: "Would you still like to purchase this product?"
                    }).then(function (answer) {
                        if (answer.proceed) {
                            makeOrder(answer.itemId);
                        } else {
                            console.log("Thanks for stopping by. We hope to see you again soon!");
                            connection.end();
                        }
                    });
                } else {
                    console.log("Your total is $" + (res[0].price * answer.itemAmount));
                    console.log("Order processing..");
                    connection.query("Update products SET ? WHERE ?", [
                        {
                            stock_quantity: res[0].stock_quantity - answer.itemAmount
                        },
                        {
                            item_id: answer.itemId
                        }
                    ], function (err, res) {
                        if (err) throw err;
                        console.log("Order confirmed.");
                    }
                    )
                }
            })
        })
}


