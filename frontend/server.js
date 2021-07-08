const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const PUBLIC_DIR = 'dist'

console.log('inis bitch')
console.log('path: ', path.join(__dirname, 'dist'))
app.use('/', express.static(path.join(__dirname, 'dist')))
app.all('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, PUBLIC_DIR, 'index.html'));
});

app.listen(port, () => console.log(`Listening on ${port}\nProject is running at http://localhost:${port}/`)) 