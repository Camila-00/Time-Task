const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.set("view engine", "ejs");
app.set("views", path.join(dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(dirname, "public")));
app.use(express.json());
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
// Route to render the index.ejs file
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
