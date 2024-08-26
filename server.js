const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const schoolRoutes = require('./routes/schoolRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', schoolRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
