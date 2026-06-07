const db = require("../config/db");

// GET ALL REPORTS
exports.getReports = (req, res) => {
  const query = `
    SELECT reports.*, users.nama
    FROM reports
    JOIN users
    ON reports.user_id = users.id
    ORDER BY reports.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

// GET DETAIL REPORT
exports.getReportById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT reports.*, users.nama
    FROM reports
    JOIN users
    ON reports.user_id = users.id
    WHERE reports.id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result[0]);
  });
};

// CREATE REPORT
exports.createReport = (req, res) => {
  const { judul, deskripsi, lokasi } = req.body;

  const foto = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO reports
    (user_id, judul, deskripsi, lokasi, foto)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [req.user.id, judul, deskripsi, lokasi, foto], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(201).json({
      message: "Laporan berhasil dibuat",
    });
  });
};

// UPDATE REPORT
exports.updateReport = (req, res) => {
  const { id } = req.params;

  const { judul, deskripsi, lokasi } = req.body;

  const query = `
    UPDATE reports
    SET judul=?, deskripsi=?, lokasi=?
    WHERE id=? AND user_id=?
  `;

  db.query(query, [judul, deskripsi, lokasi, id, req.user.id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Laporan berhasil diupdate",
    });
  });
};

// DELETE REPORT
exports.deleteReport = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM reports
    WHERE id=? AND user_id=?
  `;

  db.query(query, [id, req.user.id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Laporan berhasil dihapus",
    });
  });
};

// UPDATE STATUS (ADMIN)
exports.updateStatus = (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  db.query("UPDATE reports SET status=? WHERE id=?", [status, id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Status diperbarui",
    });
  });
};
