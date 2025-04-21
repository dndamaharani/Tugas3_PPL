const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const getData = () => {
  const data = fs.readFileSync('./data.json');
  return JSON.parse(data);
};

const saveData = (data) => {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
};

// GET semua film
app.get('/films', (req, res) => {
  const data = getData();
  res.json(data);
});

// POST film baru
app.post('/films', (req, res) => {
  const data = getData();
  const newFilm = {
    id: Date.now().toString(),
    title: req.body.title,
    director: req.body.director,
    year: req.body.year
  };
  data.push(newFilm);
  saveData(data);
  res.status(201).json(newFilm);
});

// DELETE film berdasarkan id
app.delete('/films/:id', (req, res) => {
  let data = getData();
  const filmId = req.params.id;
  const filteredData = data.filter(film => film.id !== filmId);

  if (data.length === filteredData.length) {
    return res.status(404).json({ message: 'Film tidak ditemukan' });
  }

  saveData(filteredData);
  res.json({ message: 'Film berhasil dihapus' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
