var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "127.0.01",
  port: "3306",
  user: "root",
  password: "yourpassword",
  database: "bamazon"
})
connection.connect(function(err){
  console.log("Connected as id: " + connection.threadId);
  menuOption();
})

var choices = ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"];

var menuOption = function(){
  inquirer.prompt({
    name: "menu",
    type: "list",
    message: "Select an option from the menu? \n",
    choices: choices
  }).then(function(answer){
    if (answer.menu === choices[0]){
      viewProductsSale();
    }
    else if(answer.menu === choices[1]){
      viewLowInventory();
    }
    else if(answer.menu === choices[2]){
      addInventory();
    }
    else{
      addProduct();
    }
  })
}

var viewProductsSale = function(){
  console.log("Sale is working");
  connection.query('SELECT*FROM products', function(err, result){
  for(var i=0; i< result.length; i++){
    console.log(" - ITEM_ID: " + result[i].item_id + ", PRODUCT: "+result[i].product_name + ", PRICE: "+result[i].price + ", STOCK QTY: " + result[i].stock_quantity);
  }
  })
}
var viewLowInventory = function(){
  console.log("Low inventory is working");
  connection.query('SELECT*FROM products', function(err, result){
  for(var i=0; i< result.length; i++){
    if(result[i].stock_quantity < 5){
      console.log(" - ITEM_ID: " + result[i].item_id + ", PRODUCT: "+result[i].product_name + ", PRICE: "+result[i].price + ", STOCK QTY: " + result[i].stock_quantity);
    }
  }
  })
}
var addInventory = function(){
  console.log("Add inventory is working");
  var newQuantity = 0;
  connection.query('SELECT*FROM products', function(err, result){
   inquirer.prompt([{
        name: "product",
        type: "list",
        choices: function(products){
          var choiceArray = [];
          for(var i = 0; i < result.length; i++){
            choiceArray.push(result[i].product_name);
          }return choiceArray;
        },
        message: "What product would you like to add inventory to?"
    },{ 
        name: "quantity",
        type: "input",
        message: "How many items of this product would you like to add?"
      }]).then(function(answer){
        for(var i = 0; i < result.length; i++){
          if(result[i].product_name == answer.product){
            console.log(Number(result[i].stock_quantity));
            newQuantity = Number(result[i].stock_quantity) + Number(answer.quantity);
            console.log(newQuantity);
            connection.query("UPDATE products SET? Where?",[{
              stock_quantity: newQuantity
            },{
              product_name: answer.product
            }],function(err,result){
              console.log("Inventory was successfully added!");
            })
          }
        }
      })
    })
}

var addProduct = function(){
  console.log("add product is working");
   inquirer.prompt([{
        name: "product",
        type: "input",
        message: "What product would you like to add to inventory?"
    },{
        name: "quantity",
        type: "input",
        message: "How many items of this product would you like to add?"
    },{
        name: "department",
        type: "input",
        message: "What department does the product belong to?"
    },{
        name: "price",
        type: "input",
        message: "What is the product price?",
        validate: function(value){
          if(isNaN(value)==false){
              return true;
      } else{
          return false;
      }
    }
  }]).then(function(answer){
      connection.query("INSERT INTO products SET?",{
          product_name: answer.product,
          stock_quantity: answer.quantity,
          department_name: answer.department,
          price: answer.price
         },function(err,result){
              console.log("Your product was added successfully!");
      })
    })
}
