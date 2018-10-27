const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazonDB'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("You are connected [manager]");
    managerAction()
})

function managerAction(){

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Options: ',
        choices: ['View product sales', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
        filter: function (val){
            if(val === 'View product sales'){
                return 'sale';
            } else if(val === 'View Low Inventory'){
                return 'lowInventory';
            } else if(val === 'Add to Inventory'){
                return 'addToInventory';
            } else if(val === 'Add New Product'){
                return 'newProduct';
            } else {
                console.log('Error: Invalid Operation');
            }
        }
    }]).then(function(operation){
        console.log(operation);

        if(operation.action === 'sale'){
            sale();
        } else if(operation.action === 'lowInventory'){
            lowInventory();
        } else if(operation.action === 'addToInventory'){
            addToInventory();
        } else if(operation.action === 'newProduct'){
            newProduct();
        } else {
            console.log('Error: Invalid Operation');
        }
    })
}


function sale(){
    connection.query('SELECT * FROM products', function(err, response) {
        if(err) throw err;

        for (i = 0; i < response.length; i++) {
            // console.log(response[i])
            let products =
                "====================================\n" +
                response[i].item_id + " || " + response[i].product_name + " || " + response[i].department_name + " || " + response[i].price + " || " + response[i].stock_quantity;

            console.log(products)
        }

        process.exit();
    })
}

function lowInventory(){
    connection.query('SELECT * FROM products WHERE stock_quantity < 100', function(err, response) {
        if(err) throw err;

        for (i = 0; i < response.length; i++) {
            // console.log(response[i])
            let products =
                "====================================\n" +
                response[i].item_id + " || " + response[i].product_name + " || " + response[i].department_name + " || " + response[i].price + " || " + response[i].stock_quantity;

            console.log(products)
        }

        process.exit();

    })
}

function validateNumber(value){
    if(isNaN(value) === false){
        return true;
    } else {
        return false;
    }
  }

function addToInventory(){

    inquirer.prompt([{
        type: 'input',
        name: 'item_id',
        message: 'Enter Item_id for stock update: ',
        validate: validateNumber,
        filter: Number
    },
    {
        type: 'input',
		name: 'quantity',
		message: 'Please enter amaount',
		validate: validateNumber,
		filter: Number
    }]).then(function(input){
        connection.query("SELECT * FROM products WHERE ?",{
            item_id: input.item_id
        }, function (err, data) {
            if(err) throw err;
            console.log(data[0].stock_quantity);

            if(data.length === 0){
                console.log('Invalid Item_id');
				addToInventory();
            } else {
                connection.query("UPDATE products SET stock_quantity = " + (data[0].stock_quantity + input.quantity) + " WHERE item_id = " + input.item_id, function(err,resp){
                    if(err) throw err;
                    console.log("===========================================");
                    console.log('Stock count for Item ID ' + input.item_id + " "+ data[0].product_name + ' has been updated to ' + data[0].stock_quantity + '.');
                    console.log("===========================================");

					// End the database connection
                    process.exit();
                })
            }
        })
    })
}

// function newProduct(){
//      inquirer.prompt([
//         {
// 			type: 'input',
// 			name: 'product_name',
// 			message: 'Please enter the new product name.',
// 		},
// 		{
// 			type: 'input',
// 			name: 'department_name',
// 			message: 'Which department does the new product belong to?',
// 		},
// 		{
// 			type: 'input',
// 			name: 'price',
// 			message: 'What is the price per unit?',
// 			validate: validateNumber
// 		},
// 		{
// 			type: 'input',
// 			name: 'stock_quantity',
// 			message: 'How many items are in stock?',
// 			validate: validateNumber
// 		}
//      ])
// }