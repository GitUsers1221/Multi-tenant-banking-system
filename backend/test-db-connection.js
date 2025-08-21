const mysql = require("mysql2/promise");

async function testConnection() {
  try {
    console.log("🔧 Testing database connection...");

    // Test connection without database first
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "class",
    });

    console.log("✅ Connected to MySQL server");

    // Check if project database exists
    const [databases] = await connection.query("SHOW DATABASES");
    const projectExists = databases.some((db) => db.Database === "project");

    if (projectExists) {
      console.log("✅ Project database exists");

      // Connect to project database
      await connection.query("USE project");
      console.log("✅ Connected to project database");

      // Test query
      const [tables] = await connection.query("SHOW TABLES");
      console.log(
        "📋 Available tables:",
        tables.map((t) => Object.values(t)[0])
      );

      // Test a simple query
      const [customers] = await connection.query(
        "SELECT COUNT(*) as count FROM customers"
      );
      console.log("👥 Number of customers:", customers[0].count);
    } else {
      console.log("❌ Project database does not exist");
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}

testConnection();
