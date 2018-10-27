let inquirer = require('inquirer');
let mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazonDB'
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("You are connected [customer]");
    mktable();
})

//create a table function
let mktable = function () {
    connection.query("SELECT * FROM products", function (err, response) {
        for (i = 0; i < response.length; i++) {
            // console.log(response[i])
            let products =
                "====================================\n" +
                response[i].item_id + " || " + response[i].product_name + " || " + response[i].department_name + " || " + response[i].price + " || " + response[i].stock_quantity;

            console.log(products)
        }

        purchasePrompt(response);
    })
}

let purchasePrompt = function (response) {
    inquirer.prompt([{
        type: "input",
        name: "purchase",
        message: "what would you like to purchase? [type quit to quit]: "
    }]).then(function (res) {
        let condition = false;
        
        if (res.purchase === "quit") {
            process.exit();
        }
        for (i = 0; i < response.length; i++) {
            // console.log(res);
            if (response[i].product_name === res.purchase) {
                condition = true;


                let item = res.purchase;
                let id = i;
                inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message: "How many would you like to purchase?",
                    validate: function (val) {
                        if (isNaN(val) === false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function (amount) {
                    if ((response[id].stock_quantity - amount.quantity) > 0) {
                        connection.query("UPDATE products SET stock_quantity='" + (response[id].stock_quantity - amount.quantity) + "' WHERE product_name='" + item + "'", function (err, resp) {
                            console.log("Thank you for your purchase!");
                            // console.log(res.purchase);
                            // console.log(item)
                            mktable();
                        })
                    } else {
                        console.log("none selected");
                        purchasePrompt(response);
                    }
                })
            }
            // else {
            //     console.log("none selected");
            //     purchasePrompt(response);
            // }
        } if (i === response.length && condition === false) {
            console.log("Invalid");
            purchasePrompt(res)
        }
    })
}