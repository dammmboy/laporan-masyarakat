const db = require("../config/db");

// GET COMMENTS BY REPORT ID
exports.getCommentsByReportId = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT comments.*, users.nama 
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.report_id = ?
    ORDER BY comments.created_at ASC
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
};

// CREATE COMMENT
exports.createComment = (req, res) => {
  const { id } = req.params; // report_id
  const { komentar } = req.body;

  if (!komentar) {
    return res.status(400).json({ message: "Komentar tidak boleh kosong" });
  }

  const query = `
    INSERT INTO comments (report_id, user_id, komentar)
    VALUES (?, ?, ?)
  `;

  db.query(query, [id, req.user.id, komentar], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(201).json({
      message: "Komentar berhasil ditambahkan",
      commentId: result.insertId
    });
  });
};
