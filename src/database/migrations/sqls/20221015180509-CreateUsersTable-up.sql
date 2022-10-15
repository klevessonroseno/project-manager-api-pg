/* Replace with your SQL commands */

CREATE TABLE users(
  id VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INT NOT NULL
);