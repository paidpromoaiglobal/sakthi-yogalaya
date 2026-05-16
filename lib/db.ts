import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export async function getPool(): Promise<mysql.Pool> {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER!,
      password: process.env.DB_PASS!,
      database: process.env.DB_NAME || "guruji_dev",
      waitForConnections: true,
      connectionLimit: 5,
    });
    await initTables(pool);
  }
  return pool;
}

async function initTables(p: mysql.Pool) {
  await p.query(`
    CREATE TABLE IF NOT EXISTS summercamp_sy (
      id INT AUTO_INCREMENT PRIMARY KEY,
      enrollment_id VARCHAR(36) NOT NULL UNIQUE,
      plan VARCHAR(20),
      kids_name VARCHAR(200),
      dob VARCHAR(20),
      grade VARCHAR(100),
      experience VARCHAR(100),
      parents_name VARCHAR(200),
      whatsapp VARCHAR(50),
      email VARCHAR(200),
      address TEXT,
      timing VARCHAR(50),
      stripe_session_id VARCHAR(200),
      amount_base DECIMAL(10,2),
      amount_fee DECIMAL(10,2),
      amount_total DECIMAL(10,2),
      status ENUM('step_plan','step_child','step_parent','step_timing','pending_payment','paid','failed') DEFAULT 'step_plan',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_stripe (stripe_session_id),
      INDEX idx_status (status)
    )
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS summercamp_sy_config (
      config_key VARCHAR(100) PRIMARY KEY,
      config_value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}
