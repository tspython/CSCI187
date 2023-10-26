const express = require('express');
// TODO: add imports for ORM and Auth

const app = express();
const port = process.env.PORT || 3000;

//TODO: create routes for user login/logout/register

app.get('/', (req, res) => {
  res.send('Hello, Travel Helpers!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

