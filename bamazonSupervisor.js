var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "yourpassword",
  database: "bamazon"
})

connection.connect(function(err){
  if (err) throw err;
  // console.log('Connected as id: ' + connection.threadId);
  menuOption();
})
var Table = require('cli-table2');
var choices = ["View Product Sales By Department", "Create New Department"];
var menuOption = function(){
  inquirer.prompt({
    name: "menu",
    type: "list",
    message: "Select an option from the menu? \n",
    choices: choices
  }).then(function(answer){
    if (answer.menu === choices[0]){
      viewProductsSalesByDept();
    }
    else{
      addDepartment();
    }
  })
}

var viewProductsSalesByDept = function(){
  console.log("sales by dept");
  // instantiate 
  var table = new Table({
      head: ['department_id', 'department_name', 'overhead_costs', 'product_sales', 'total_profit']
    , colWidths: [15, 25, 20, 20, 20]
  });

  // table is an Array, so you can `push`, `unshift`, `splice` and friends 
  connection.query("SET sql_mode = ''", function(err, result){});
  connection.query('SELECT departments.department_id, departments.department_name, departments.overhead_costs, products.product_sales, SUM(product_sales) AS deptSalesSum,  SUM(product_sales) - departments.overhead_costs AS totalProfit FROM departments RIGHT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name ORDER BY departments.department_id', function(err, result){
    for(var i=0; i< result.length; i++){
      // console.log(result[i]);
      table.push(
      [result[i].department_id, result[i].department_name, result[i].overhead_costs, result[i].deptSalesSum, result[i].totalProfit]
     );
    }
  console.log(table.toString());
  })
}

var addDepartment = function(){
  console.log("add department is working");
   inquirer.prompt([{
        name: "department",
        type: "input",
        message: "What is the name of the new department you would like to add? \n"
  }]).then(function(answer){
      connection.query("INSERT INTO departments SET?",{
          department_name: answer.department,
          overhead_costs: 10000
         },function(err,result){
            console.log(answer.department + " department was added successfully!");
      })
    })
}
