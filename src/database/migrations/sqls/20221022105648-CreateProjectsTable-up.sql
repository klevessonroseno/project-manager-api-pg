CREATE TABLE projects(
	id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL UNIQUE,
  description VARCHAR(500) NULL,
  deadline DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  finished BOOLEAN DEFAULT FALSE,
  manager_id INT NOT NULL,
  FOREIGN KEY (manager_id) REFERENCES managers (id)
);