var express = require('express');

var app = express();

app.listen(4000);

//set the folder where our static documents are located
app.use(express.static('c:/Node/nodejs/flashkards-v2'));