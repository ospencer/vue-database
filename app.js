const express = require('express')
const { reactive, watchEffect } = require('vue')
const { 
  tweet, 
  yeet, 
  initCreateSpreadsheet, 
  whiteHeat, 
  somethingBittersweet 
} = require('./effects.js')

const database = require('./database.js')

watchEffect(tweet)
watchEffect(yeet)

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => res.send('Database contents: ' + JSON.stringify(database, null, 2)))
app.post('/users', (req, res) => {
  database.push(req.body)
  res.sendStatus(201)
})
app.delete('/users/:name', (req, res) => {
  database.forEach((record) => {
    if (record.name === req.params.name) {
      record.yeet = true
    }
  })
  res.sendStatus(200)
})

app.patch('/users/:name', (req, res) => {
  database.forEach((record) => {
    if (record.name === req.params.name) {
      for (let [k, v] of Object.entries(req.body)) {
        record[k] = v
      }
    }
  })
  res.sendStatus(200)
})
app.post('/superusers', (req, res) => {
  const record = reactive(req.body)
  watchEffect(initCreateSpreadsheet(record))
  database.push(record)
  res.sendStatus(201)
})

app.delete('/purge', (req, res) => {
  watchEffect(whiteHeat)
  watchEffect(somethingBittersweet)
  database.length = 0
  res.sendStatus(200)
})

app.listen(port, () => console.log(`Fired up that sweet Vue DB on port ${port}!`))
