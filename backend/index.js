const connectToMongo = require("./db");
const express = require('express')
connectToMongo();
const app = express()
const port = 5000


app.use(express.json()); //json middleware to use req.body

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})