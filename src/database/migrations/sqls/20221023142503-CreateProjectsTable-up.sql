CREATE TABLE projects(
	id VARCHAR(200) PRIMARY KEY NOT NULL,
  title VARCHAR(200) NOT NULL,
  description VARCHAR(500),
  deadline DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finished BOOLEAN DEFAULT FALSE,
  user_id VARCHAR(200) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);