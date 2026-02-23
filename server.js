const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: path.join(__dirname, 'public', 'uploads') });

const VOTERS_FILE = path.join(__dirname, 'voters.json');

async function readVoters() {
  try {
    const txt = await fs.readFile(VOTERS_FILE, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (e) {
    return [];
  }
}

async function writeVoters(list) {
  await fs.writeFile(VOTERS_FILE, JSON.stringify(list, null, 2), 'utf8');
}

app.post('/api/register', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, voterId, password, dob, address } = req.body;

    if (!name || !email || !voterId || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const voters = await readVoters();
    if (voters.find(v => v.voterId === voterId)) {
      return res.status(400).json({ success: false, message: 'Voter ID already registered.' });
    }
    if (voters.find(v => v.email === email)) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newVoter = {
      id: Date.now().toString(),
      name,
      email,
      voterId,
      passwordHash: hash,
      dob: dob || null,
      address: address || null,
      photo: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date().toISOString()
    };

    voters.push(newVoter);
    await writeVoters(voters);

    return res.json({ success: true, message: 'Registration successful.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

app.get('/api/voters', async (req, res) => {
  const voters = await readVoters();
  res.json(voters.map(v => ({ id: v.id, name: v.name, email: v.email, voterId: v.voterId, createdAt: v.createdAt }))); // safe listing
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
