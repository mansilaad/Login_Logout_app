const express= require('express');
const cors= require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { createPool } = require('mysql');

const app= express();
const saltRounds = 10;
const jwt= require('jsonwebtoken');
const SECRET = process.env.SECRET;
const { verifyJWT } = require('./auth/token_validation');


app.use(express.json());
app.use(cors());

const db= createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
})
db.on('connection', () => {
    console.log("Database connection successfull");
})

app.post('/register', (req,res)=>{
    const username= req.body.username;
    const password= req.body.password;
    if(!username || !password){
        return res.status(400).send({success: false, message: "Parameter miising."})
    }

    bcrypt.hash(password,saltRounds, (err, hash)=> {
        if(err) {
            console.log(err);
        }
        db.query('insert into users (username, password ) values (?,?)',
        [username, hash], (err, result)=>{
            if(result.affectedRows){
                console.log(result)
           return res.status(200).send({
               success: true,
               message: "registered successfully",
           });
       }else{
           console.log(err);
           return res.status(400).send({
               success: false,
               message: "not registered successfully",
           });}
           
       });

    })

   
})

app.post('/login', (req,res)=> {
    const username= req.body.username;
    const password= req.body.password;
    console.log(username, password)

    db.query("select * from users where username=?",
     [username], (err, result)=>{
         if(err){
             res.status(400).send({
                success: false,
                err: err
             })
         }
           if(result.length>0) {
             //  console.log("result",result)
               bcrypt.compare(password, result[0].password, (err, response)=>{
                   if(response){
                     const id= result[0].id;

                    const token= jwt.sign( {id}, SECRET, { expiresIn: 300 })

                    return res.status(200).send({auth: true, token: token,result: result} );}

                else return res.send({auth: false, message: "wrong password"});
               })
            }
            else{
                return res.status(200).send({auth: false,message: "User doesn't exist" } );
            }
        })
    })

    app.get('/isUserAuth', verifyJWT, (req,res)=>{
        res.send("You are Authenticated");;
    })

const port = process.env.APP_PORT;
app.listen(port, ()=>{
    console.log("running server");
})