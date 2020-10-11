const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntkdr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


 

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const eventcollection = client.db("volunteerNetwork").collection("eventsCollection");
  const volunteersCollection = client.db("volunteerNetwork").collection("volunteers");

  app.post('/addEvent', (req, res) => {
    const events = req.body;
    // console.log(events)
    eventcollection.insertMany(events)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        }) 
})
app.get('/volunteersEvents', (req, res) => {
  eventcollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
})
app.post('/addVolunteer', (req, res) => {
  const volunteer = req.body;
  volunteersCollection.insertOne(volunteer)
      .then(result => {
          res.send(result)
      })
})
app.get('/volunteers', (req, res) => {
  volunteersCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
})

app.delete('/delete', (req, res) => {
  volunteersCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then(result => {

          res.send(result.deletedCount > 0)
      })
})
  
});


app.listen(process.env.PORT||port);