const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (result.length > 0) {
          return res.status(400).json({
            message: "Email sudah digunakan",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users (nama,email,password) VALUES (?,?,?)",
          [nama, email, hashedPassword],
          (err) => {
            if (err) {
              return res.status(500).json(err);
            }

            res.status(201).json({
              message: "Register berhasil",
            });
          },
        );
      },
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(400).json({
          message: "Email tidak ditemukan",
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Password salah",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );

      res.json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role,
        },
      });
    },
  );
};
