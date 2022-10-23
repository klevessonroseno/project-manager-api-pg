CREATE TABLE users (
  id VARCHAR(200) PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  isManager BOOLEAN NOT NULL DEFAULT TRUE
);
  