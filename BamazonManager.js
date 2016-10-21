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
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Products", "End Session"]
  }]).then(function(ans){
    if(ans.doThing === "View Products for Sale"){
      viewProducts();
    } else if(ans.doThing === "View Low Inventory"){
      viewLowInventory();
    } else if(ans.doThing === "Add to Inventory"){
      addToInventory();
    } else if(ans.doThing === "Add New Products"){
      addNewProducts();
    } else{
      console.log('Bye!');
    }
  });
}

//views all inventory
function viewProducts(){
  console.log('>>>>>>Viewing Products<<<<<<');

  connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  console.log('----------------------------------------------------------------------------------------------------')

  for(var i = 0; i<res.length;i++){
    console.log("ID: " + res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " + res[i].Price + " | " + "QTY: " + res[i].StockQuantity);
    console.log('--------------------------------------------------------------------------------------------------')
  }

  start();
  });
}

//views inventory lower than 5
function viewLowInventory(){
  console.log('>>>>>>Viewing Low Inventory<<<<<<');

  connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  console.log('----------------------------------------------------------------------------------------------------')

  for(var i = 0; i<res.length;i++){
    if(res[i].StockQuantity <= 5){
    console.log("ID: " + res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " + res[i].Price + " | " + "QTY: " + res[i].StockQuantity);
    console.log('--------------------------------------------------------------------------------------------------');
    }
  }

  start();
  });
}

//displays prompt to add more of an item to the store and asks how much
function addToInventory(){
  console.log('>>>>>>Adding to Inventory<<<<<<');

  connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  var itemArray = [];
  //pushes each item into an itemArray
  for(var i=0; i<res.length; i++){
    itemArray.push(res[i].ProductName);
  }

  inquirer.prompt([{
    type: "list",
    name: "product",
    choices: itemArray,
    message: "Which item would you like to add inventory?"
  }, {
    type: "input",
    name: "qty",
    message: "How much would you like to add?",
    validate: function(value){
      if(isNaN(value) === false){return true;}
      else{return false;}
    }
    }]).then(function(ans){
      var currentQty;
      for(var i=0; i<res.length; i++){
        if(res[i].ProductName === ans.product){
          currentQty = res[i].StockQuantity;
        }
      }
      connection.query('UPDATE Products SET ? WHERE ?', [
        {StockQuantity: currentQty + parseInt(ans.qty)},
        {ProductName: ans.product}
        ], function(err, res){
          if(err) throw err;
          console.log('The quantity was updated.');
          start();
        });
      })
  });
}

//allows manager to add a completely new product to store
function addNewProducts(){
  console.log('>>>>>>Adding New Product<<<<<<');
  inquirer.prompt([{
    type: "input",
    name: "product",
    message: "Product: ",
    validate: function(value){
      if(value){return true;}
      else{return false;}
    }
  }, {
    type: "input",
    name: "department",
    message: "Department: "
  }, {
    type: "input",
    name: "price",
    message: "Price: ",
    validate: function(value){
      if(isNaN(value) === false){return true;}
      else{return false;}
    }
  }, {
    type: "input",
    name: "quantity",
    message: "Quantity: ",
    validate: function(value){
      if(isNaN(value) == false){return true;}
      else{return false;}
    }
  }]).then(function(ans){
    connection.query('INSERT INTO Products SET ?',{
      ProductName: ans.product,
      DepartmentName: ans.department,
      Price: ans.price,
      StockQuantity: ans.quantity
    }, function(err, res){
      if(err) throw err;
      console.log('You added another item!');
    })
    start();
  });
}

start();