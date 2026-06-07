require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const db = require("../config/db");

const createCommentsTable = `
  CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    user_id INT NOT NULL,
    komentar TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`;

db.query(createCommentsTable, (err) => {
  if (err) {
    console.error("Error creating comments table:", err);
    process.exit(1);
  }
  console.log("Comments table created successfully!");
  process.exit(0);
});
