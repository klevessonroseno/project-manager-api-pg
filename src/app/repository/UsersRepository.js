import connect from '../../config/database';

class UsersRepository {
  async getAll() {
    try {
      const pgClient = await connect();
      const sql = `
        SELECT
          user_id id,
          user_name name,
          user_email email 
        FROM
          users
        ORDER BY id;    
      `;
      const { rows, rowCount } = await pgClient.query(sql);

      if(rowCount === 0) return null;

      return rows;

    } catch (error) {
      return error;
    }
  }

  async store(name, email, password) {
      const pgClient = await connect();
      const sql = `         
        INSERT INTO
          users 
            (
              user_name, 
              user_email, 
              user_password
            )
          VALUES
            ($1, $2, $3);
      `;
      const values = [ name, email, password ];
      const { rowCount } = await pgClient.query(sql, values);

      if(rowCount && rowCount > 0) return rowCount;

      return null;
  }
}

export default new UsersRepository();