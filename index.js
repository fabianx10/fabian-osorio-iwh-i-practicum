const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;

const CUSTOM_OBJECT_ID = '2-64688849';
const PROPERTIES = 'name,species,age';

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
  'Content-Type': 'application/json',
};

// ROUTE 1 — Homepage: GET all Pet records and show them in a table
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=${PROPERTIES}`;
  try {
    const response = await axios.get(url, { headers });
    const records = response.data.results;
    res.render('homepage', { title: 'Custom Object Table', records });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching records. Check the terminal for details.');
  }
});

// ROUTE 2 — Show the form to add a new Pet
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I: Foundations',
  });
});

// ROUTE 3 — Receive form data, create a new Pet record, then redirect home
app.post('/update-cobj', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
  const newRecord = {
    properties: {
      name: req.body.name,
      species: req.body.species,
      age: req.body.age,
    },
  };
  try {
    await axios.post(url, newRecord, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error creating record. Check the terminal for details.');
  }
});

app.listen(3000, () => console.log('App running on http://localhost:3000'));