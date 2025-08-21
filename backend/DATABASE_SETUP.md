# Database Setup Guide

## Prerequisites

1. **MySQL Server** - Make sure MySQL is installed and running on your system
2. **MySQL Client** - For connecting to the database

## Option 1: Using XAMPP (Recommended for Windows)

1. **Download and Install XAMPP**
   - Go to https://www.apachefriends.org/
   - Download XAMPP for Windows
   - Install it with default settings

2. **Start MySQL**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - The MySQL service should start on port 3306

3. **Access phpMyAdmin**
   - Open your browser
   - Go to http://localhost/phpmyadmin
   - Default credentials: username `root`, password `''` (empty)

4. **Create Database**
   - Click "New" in the left sidebar
   - Enter database name: `banking_system`
   - Click "Create"

## Option 2: Using MySQL Server Directly

1. **Install MySQL Server**
   ```bash
   # For Windows (using chocolatey)
   choco install mysql

   # For macOS (using homebrew)
   brew install mysql

   # For Ubuntu/Debian
   sudo apt-get install mysql-server
   ```

2. **Start MySQL Service**
   ```bash
   # Windows
   net start mysql

   # macOS
   brew services start mysql

   # Ubuntu/Debian
   sudo systemctl start mysql
   ```

3. **Set Root Password**
   ```bash
   mysql -u root -p
   # Enter your desired password when prompted
   ```

## Database Configuration

### Method 1: Using Environment Variables

Create a `.env` file in your project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=banking_system
```

### Method 2: Update setup-database.js

Edit the `setup-database.js` file and update the `dbConfig`:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password_here', // Update this
  database: 'banking_system'
};
```

### Method 3: Update db.js

Edit the `db.js` file and update the connection details:

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password_here', // Update this
  database: 'banking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

## Running the Setup

Once you have MySQL running and configured:

1. **Run the database setup script:**
   ```bash
   node setup-database.js
   ```

2. **Start the backend server:**
   ```bash
   node index.js
   ```

3. **Test the APIs:**
   ```bash
   node test-api.js
   ```

## Troubleshooting

### Common Issues:

1. **"Access denied for user 'root'@'localhost'"**
   - Make sure MySQL is running
   - Check your password in the configuration
   - Try connecting with: `mysql -u root -p`

2. **"Can't connect to MySQL server"**
   - Make sure MySQL service is started
   - Check if MySQL is running on port 3306
   - Try: `netstat -an | findstr 3306` (Windows) or `netstat -an | grep 3306` (Linux/Mac)

3. **"Unknown database"**
   - Run the setup script: `node setup-database.js`
   - Or create the database manually in phpMyAdmin

### Testing MySQL Connection:

```bash
# Test connection
mysql -u root -p

# If successful, you should see the MySQL prompt
mysql>
```

### Manual Database Creation:

If the setup script fails, you can create the database manually:

1. **Connect to MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE banking_system;
   USE banking_system;
   ```

3. **Create tables (run these SQL commands):**
   ```sql
   CREATE TABLE customers (
     customer_id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     age INT NOT NULL,
     gender ENUM('Male', 'Female', 'Other') NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE accounts (
     account_id INT AUTO_INCREMENT PRIMARY KEY,
     customer_id INT NOT NULL,
     account_type ENUM('Savings', 'Checking', 'Business') NOT NULL,
     balance DECIMAL(10,2) DEFAULT 0.00,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
   );

   CREATE TABLE banks (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     branch VARCHAR(100) NOT NULL,
     location VARCHAR(200) NOT NULL,
     phone_number VARCHAR(20),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE loans (
     id INT AUTO_INCREMENT PRIMARY KEY,
     customer_id INT NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
   );

   CREATE TABLE audit_log (
     id INT AUTO_INCREMENT PRIMARY KEY,
     action VARCHAR(50) NOT NULL,
     table_name VARCHAR(50) NOT NULL,
     record_id INT NOT NULL,
     user_id INT,
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Quick Start with XAMPP

1. **Install XAMPP**
2. **Start MySQL in XAMPP Control Panel**
3. **Update setup-database.js with empty password:**
   ```javascript
   password: '', // Empty password for XAMPP default
   ```
4. **Run:** `node setup-database.js`
5. **Start backend:** `node index.js`
6. **Test APIs:** `node test-api.js`

## Verification

After setup, you should be able to:

1. ✅ Run `node setup-database.js` successfully
2. ✅ Run `node index.js` without errors
3. ✅ Run `node test-api.js` and see successful API responses
4. ✅ Access the frontend at `http://localhost:8000` and see data

If you encounter any issues, check the troubleshooting section above or provide the specific error message for further assistance. 