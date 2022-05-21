const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Manufacturing Products Server');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})