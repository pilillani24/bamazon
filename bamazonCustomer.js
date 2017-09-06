var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "yourpassword",
  database: "bamazon"
})
//after you create your connection object run the code below
connection.connect(function(err){
  if (err) throw err;
  console.log('Connected as id: ' + connection.threadId);
  display();
})

var display = function(){
  connection.query('SELECT*FROM products', function(err, result){
    inquirer.prompt({
      name: 'chooseProduct',
      type: 'rawlist',
      choices: function(products){
        var choiceArray = [];
        for (var i = 0; i < result.length; i++){
          choiceArray.push(result[i].product_name);
        }
        return choiceArray;
      },
      message: 'Welcome to Hack Bamazon \n' + '\n Pick a product you will like to purchase'
    }).then(function(answer) {
      for (var i = 0; i < result.length; i++) {
        if (result[i].product_name == answer.chooseProduct){
          var chosenItem = result[i];
          console.log(answer.chooseProduct);
          inquirer.prompt({ 
            name: "quantity",
            type: "input",
            message: "\n How many items will you like to purchase?",
            validate: function(value) { 
              if (isNaN(value) == false) {
                return true;
              } else {
                return false;
              }
            }
          }).then(function(answer) {
            if (answer.quantity <= chosenItem.stock_quantity) {
              console.log("You are purchasing " + answer.quantity + " " + chosenItem.product_name);
              var totalRev = Number(answer.quantity)*Number(chosenItem.price) + Number(chosenItem.product_sales);
              var newStockQty = Number(chosenItem.stock_quantity) - Number(answer.quantity);
              console.log(totalRev);
              connection.query("UPDATE products SET? Where?",[{
                  product_sales:  totalRev,
                  stock_quantity: newStockQty
                },{
                  product_name: chosenItem.product_name,
                }],function(err,result){
             
                      console.log("Your transaction was processed successfully!");
              })
            } else {
              console.log("Insufficient quantity!");
            }
          })
        }
      }
    })
  }) 
}
