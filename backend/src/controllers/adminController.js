const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ===== STATISTICS =====
exports.getStats = (req, res) => {
  const statsQuery = `
    SELECT
      (SELECT COUNT(*) FROM reports) AS totalLaporan,
      (SELECT COUNT(*) FROM reports WHERE status = 'menunggu') AS menunggu,
      (SELECT COUNT(*) FROM reports WHERE status = 'diproses') AS diproses,
      (SELECT COUNT(*) FROM reports WHERE status = 'selesai') AS selesai,
      (SELECT COUNT(*) FROM users WHERE role = 'user') AS totalUser
  `;

  db.query(statsQuery, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// ===== USER MANAGEMENT =====
exports.getAllUsers = (req, res) => {
  const query = `
    SELECT id, nama, email, role, created_at,
      (SELECT COUNT(*) FROM reports WHERE user_id = users.id) AS totalLaporan
    FROM users
    ORDER BY created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT id, nama, email, role, created_at FROM users WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(result[0]);
  });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nama, email, role, password } = req.body;

  try {
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      db.query(
        "UPDATE users SET nama=?, email=?, role=?, password=? WHERE id=?",
        [nama, email, role, hashed, id],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "User berhasil diupdate" });
        }
      );
    } else {
      db.query(
        "UPDATE users SET nama=?, email=?, role=? WHERE id=?",
        [nama, email, role, id],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "User berhasil diupdate" });
        }
      );
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User berhasil dihapus" });
  });
};

// ===== REPORT MANAGEMENT =====
exports.getAllReports = (req, res) => {
  const query = `
    SELECT reports.*, users.nama AS nama_pelapor
    FROM reports
    JOIN users ON reports.user_id = users.id
    ORDER BY reports.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.updateReportStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["menunggu", "diproses", "selesai"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  db.query("UPDATE reports SET status=? WHERE id=?", [status, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Status laporan berhasil diperbarui" });
  });
};

exports.deleteReport = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM reports WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Laporan berhasil dihapus" });
  });
};
