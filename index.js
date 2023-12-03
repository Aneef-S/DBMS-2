const express = require('express');
const app = express();
const path = require('path');

app.set('views',__dirname+'/views');

app.set('view engine','hbs');

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/CreateAccount',(req,res)=>{
    res.render('CreateAccountPage');
})

app.listen(3000,()=>{
    console.log("server started");
})