// -> cmd: supervisor app.js
const express = require('express');

const app = express();

app.use('/docs', express.static('docs'));

app.get("/",(req,res)=>{
    res.send('express 搭建后台服务');
});
app.listen(5200);
console.log("http://127.0.0.1:5200/");