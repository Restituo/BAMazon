//require mysql and inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');
//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "Bamazon"
})

function start(){
  inquirer.prompt([{
    type: "list",
    name: "doThing",
    message: "What would you like to do?"
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Products"]
  }]).then(function(ans){
    if(ans.doThing === "View Products for Sale"){
      viewProducts();
    } else if(ans.doThing === "View Low Inventory"){
      viewLowInventory();
    } else if(ans.doThing === "Add to Inventory"){
      addToInventory();
    } else if(ans.doThing === "Add New Products"){
      addNewProducts();
    }
  });
}

//views all inventory
function viewProducts(){
  connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  console.log('----------------------------------------------------------------------------------------------------')

  for(var i = 0; i<res.length;i++){
    console.log("ID: " + res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " + res[i].Price + " | " + "QTY: " + res[i].StockQuantity);
    console.log('--------------------------------------------------------------------------------------------------')
  }
}

//views inventory lower than 5
function viewLowInventory(){

}

//displays prompt to add more of an item to the store and asks how much
function addToInventory(){

}

//allows manager to add a completely new product to store
function addNewProducts(){

}

start();