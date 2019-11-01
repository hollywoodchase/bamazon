let mysql = require('mysql');
let inquirer = require('inquirer');
let fullData = [];

var connection = mysql.createConnection({
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

    connection.query('SELECT * FROM `products`',
        function (err, res) {
            if (err) throw err;
            fullData = res;
            console.log(fullData);
            var products = [];

            for (let i = 0; i < fullData.length; i++) {
                let product = fullData[i].product_name.replace(/_/g, " ");
                products.push(product);
            }
            console.log(products);

            inquirer
                .prompt([{
                    type: "input",
                    name: "id",
                    message: "What is the id of the product you are looking for?",
                },
                {
                    type: "input",
                    name: "units",
                    message: "How many units would you like to buy?"
                }]).then(function (answers) {
                    let ind = products.indexOf(answers.id);
                    console.log(fullData[ind].stock_quantity);

                    if (ind !== -1 && fullData[ind].stock_quantity >= 0) {
                        console.log('We have ' + fullData[ind].stock_quantity + ' left!');
                        console.log("You asked for " + answers.units);
                        let leftover = fullData[ind].stock_quantity - answers.units;

                        if (leftover === 0) {
                            console.log("You got the last one!");

                            connection.query("UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: leftover
                                    },
                                    {
                                        product_name: answers.id
                                    }
                                ],
                                function (err) {
                                    console.log(leftover);
                                    let cost = answers.units * fullData[ind].price;
                                    console.log("Your cost will be $" + cost);
                                    console.log("Quantity updated!\n");
                                    connection.end();
                                }
                            );
                        }
                        else if (leftover < 0) {
                            console.log("You asked for too many!");
                        } else {
                            console.log("We now have " + leftover + " left");

                            var query = connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: leftover
                                    },
                                    {
                                        product_name: answers.id
                                    }
                                ],
                                function (err) {
                                    let cost = answers.units * fullData[ind].price;
                                    console.log("Your cost will be $" + cost);
                                    console.log("Quantity updated!\n");
                                }
                            );
                        }
                    } else {
                        console.log("We don't carry that");
                    }
                });
        });
        module.export({products});
}
