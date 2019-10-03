-- Drops the animals_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_DB;
-- Creates the "animals_db" database --
CREATE DATABASE bamazon_DB;

-- Makes it so all of the following code will affect animals_db --
USE bamazon_DB;


CREATE TABLE products (
 
 id INT NOT NULL AUTO_INCREMENT,
 
  product_name VARCHAR(40),

  department_name VARCHAR(40),
  
  
  price DECIMAL(10,4) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY(id)
);



