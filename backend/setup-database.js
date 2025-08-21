const mysql = require("mysql2/promise");

// Database configuration - update these values according to your MySQL setup
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'maksad', // Update this with your MySQL password
  database: 'project'
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔧 Setting up Banking Management System Database...\n');
    
    // First, connect without specifying database to create it if it doesn't exist
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log(`✅ Database '${dbConfig.database}' created/verified`);
    
    // Use the database
    await connection.query(`USE ${dbConfig.database}`);
    
    // Create customers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        customer_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Customers table created/verified');
    
    // Create accounts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        account_id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        account_type ENUM('Savings', 'Checking', 'Business') NOT NULL,
        balance DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `);
    console.log('✅ Accounts table created/verified');
    
    // Create banks table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS banks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        branch VARCHAR(100) NOT NULL,
        location VARCHAR(200) NOT NULL,
        phone_number VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Banks table created/verified');
    
    // Create loans table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )
    `);
    console.log('✅ Loans table created/verified');
    
    // Create transactions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id INT AUTO_INCREMENT PRIMARY KEY,
        account_id INT NOT NULL,
        transaction_type ENUM('Deposit', 'Withdrawal', 'Transfer', 'Payment') NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(account_id)
      )
    `);
    console.log('✅ Transactions table created/verified');
    
    // Create audit_log table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(50) NOT NULL,
        table_name VARCHAR(50) NOT NULL,
        record_id INT NOT NULL,
        user_id INT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Audit log table created/verified');
    
    // Insert sample data
    console.log('\n📊 Inserting sample data...');
    
    // Sample customers
    await connection.query(`
      INSERT IGNORE INTO customers (customer_id, name, age, gender) VALUES
      (1, 'John Doe', 30, 'Male'),
      (2, 'Jane Smith', 25, 'Female'),
      (3, 'Bob Johnson', 45, 'Male')
    `);
    console.log('✅ Sample customers inserted');
    
    // Sample accounts
    await connection.query(`
      INSERT IGNORE INTO accounts (account_id, customer_id, account_type, balance) VALUES
      (1, 1, 'Savings', 5000.00),
      (2, 1, 'Checking', 2500.00),
      (3, 2, 'Savings', 3000.00),
      (4, 3, 'Business', 15000.00)
    `);
    console.log('✅ Sample accounts inserted');
    
    // Sample banks
    await connection.query(`
      INSERT IGNORE INTO banks (id, name, branch, location, phone_number) VALUES
      (1, 'First National Bank', 'Main Branch', 'New York, NY', '212-555-0100'),
      (2, 'City Bank', 'Downtown Branch', 'Los Angeles, CA', '213-555-0200'),
      (3, 'Metro Bank', 'Central Branch', 'Chicago, IL', '312-555-0300')
    `);
    console.log('✅ Sample banks inserted');
    
    // Sample loans
    await connection.query(`
      INSERT IGNORE INTO loans (id, customer_id, amount, status) VALUES
      (1, 1, 10000.00, 'Approved'),
      (2, 2, 5000.00, 'Pending'),
      (3, 3, 25000.00, 'Approved')
    `);
    console.log('✅ Sample loans inserted');
    
    // Sample transactions
    await connection.query(`
      INSERT IGNORE INTO transactions (transaction_id, account_id, transaction_type, amount, description) VALUES
      (1, 1, 'Deposit', 1000.00, 'Initial deposit'),
      (2, 1, 'Withdrawal', 500.00, 'ATM withdrawal'),
      (3, 2, 'Deposit', 2500.00, 'Salary deposit'),
      (4, 3, 'Transfer', 1000.00, 'Transfer to savings')
    `);
    console.log('✅ Sample transactions inserted');
    
    // Sample audit logs
    await connection.query(`
      INSERT IGNORE INTO audit_log (id, action, table_name, record_id, user_id) VALUES
      (1, 'CREATE', 'customers', 1, 1),
      (2, 'CREATE', 'accounts', 1, 1),
      (3, 'UPDATE', 'accounts', 1, 1),
      (4, 'CREATE', 'banks', 1, 1)
    `);
    console.log('✅ Sample audit logs inserted');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Database Summary:');
    console.log(`   - Database: ${dbConfig.database}`);
    console.log(`   - Host: ${dbConfig.host}`);
    console.log(`   - User: ${dbConfig.user}`);
    console.log('\n📊 Sample Data:');
    console.log('   - 3 customers');
    console.log('   - 4 accounts');
    console.log('   - 3 banks');
    console.log('   - 3 loans');
    console.log('   - 4 transactions');
    console.log('   - 4 audit logs');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure MySQL is running');
    console.log('   2. Check your MySQL credentials');
    console.log('   3. Update the dbConfig in this file if needed');
    console.log('   4. Make sure you have CREATE DATABASE privileges');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupDatabase(); 