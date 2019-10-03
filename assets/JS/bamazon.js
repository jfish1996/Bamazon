var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("---------------------------------------------")
  console.log("Current Products")
  console.log("---------------------------------------------")

  var query = "SELECT * FROM bamazon_db.products;";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res)
    askUserForStuff();
    
  
   
  });

});



function askUserForStuff(){
  inquirer.prompt({
    name: "thingToDo",
    type:"list",
    message:"what do you want to do?",
    choices:["BUY AN ITEM","VIEW STOCK", "QUIT"]
  }).then(function(answer){
   

    if(answer.thingToDo==="BUY AN ITEM"){

        console.log("buy an item");
        buyAnItem();
        

      
    }else if(answer.thingToDo=="VIEW STOCK") {
      var query = "SELECT * FROM bamazon_db.products;";
      connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("Current stock---------------------------------------------")
        console.table(res)
        console.log("---------------------------------------------")
        askUserForStuff()
        
      });


    } else {
        connection.end()
    }
  })
}

function buyAnItem(){

      connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        
        var auctionNames = [];
        for(let i =0; i < res.length; i++){

            auctionNames.push(res[i].product_name)
        }
      
        inquirer.prompt([{
            name:"item",
            type:"rawlist",
            choices:auctionNames,
            message:"which item?"

        },{
            name:"quantity",
            message:"how many would you like to buy?"
        }

    ]).then(function(Anwsers){
            orderProcess(Anwsers.item, Anwsers.quantity);
        });
})

}





function orderProcess(item, quantity){

    var query = "SELECT * FROM bamazon_db.products WHERE product_name = ?"

    connection.query(query, [item], function(err, res) {
        if (err) throw err;
        console.table(res);


        if(res[0].stock_quantity === 0){
          console.log("--------------------------------------------")
            console.log("Were out for now");
            console.log("--------------------------------------------")
            updateStock(item, 100);
            askUserForStuff()

        }else if(res[0].stock_quantity < quantity) {
          console.log("--------------------------------------------")
            console.log("We dont have enough");
            console.log("--------------------------------------------")
            askUserForStuff()

        }else {
            console.log("-------------------------------");
            console.log("that will be $" + (res[0].price * quantity))
            var newQuantity = res[0].stock_quantity - quantity;
            updateStock(item, newQuantity)
            
        }
        

       
      });
}

function updateStock(item, quantity){
    var query = "UPDATE bamazon_db.products SET stock_quantity = ? WHERE product_name = ?"
    
    connection.query(query, [quantity, item], function(err, res) {
        if (err) throw err;
        // connection.end();
    })
    askUserForStuff();
}

