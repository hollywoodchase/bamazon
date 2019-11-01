let mysql = require('mysql');
let inquirer = require('inquirer');
let cust = require('./bamazonCustomer');

console.log(cust.products);

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Gnocchi420*",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {
    inquirer
    .prompt([{
        type: "list",
        name: "manager_selection",
        message: "Hello manager, please make a selection",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function(answers) {
        let selection = answers.manager_selection;
        let inventory = [];
        switch (selection) {
            case "View Products for Sale":
            connection.query("SELECT * FROM `products`", 
            function(err, res) {
                if (err) throw err;
                inventory = res;
                console.log(inventory);
            });
            // case "View Low Inventory":
            //     for (let i = 0; i < inventory) {

            //     }
        }
        
        
    });
}
