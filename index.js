const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const User = require('./src/models/User')
require('./src/config/db')
var nodemailer = require('nodemailer');




app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'maicdo74@gmail.com',
      pass: 'cmd34533'
    }
  });

let mailOptions = {
    from: 'maicdo74@gmail.com',
    to: 'myfriend@yahoo.com',
    subject: 'Sending Verification Email using Node.js',
    html: '<h1>Click on this link: </h1>'
  };

app.get('/ping', (req, res) => {
    res.send({
        data: 'pong'
    })
})

app.post('/register', (req, res) => {
    let { email, name, username, password } = req.body
    console.log(email, name, username, password)

    const token = require('crypto').randomBytes(16).toString('hex')

    let newUser = new User({
        name,
        email,
        password,
        token,
        active: false,
        username
    })

    mailOptions.to = email;

    User.findOne({username}, (err, obj) => {
       
        if(err) console.log(err);
        else {
            
            if(obj) res.status(401).send("Username has been existed");
            else {
            
                    console.log("dsdsd")
                    User.findOne({email}, (err, obj)=> {
                        if(err) console.log(err);
                        else {
                            if(obj) res.status(401).send("email has been existed ");
                            else {
                                console.log("maisss")
                                newUser.save((err, user) => {
                                    if (!err) {
                                        let { _id } = user
                                        const url = `'http://localhost:3030//auth/verification/verify-account/${_id}/${token}'` 

                                        mailOptions.html = '<a href="{url}">click here</a>'

                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                              console.log(error);
                                            } else {
                                              console.log('Email sent: ' + info.response);
                                            }
                                          });



                                        res.send({ data: 'ok', urlVerify: url })
                                        
                                    } else
                                        res.send({ data: `${err}` })
                                    }
                                
                                )
            
                            }
                        }
                    })
            }
        }
    })

})



app.get('/auth/verification/verify-account/:userId/:token', (req, res) => {
    const { userId, token } = req.params;
    User.findOne({ _id: userId }, (err, doc) => {
        if (err) {
            res.send({ data: `${err}` })
        } else {
            // const { token: dataToken } = doc;
            const dataToken = doc.token;
            if (token == dataToken) {
                doc.active = true
                doc.save((err, data) => {
                })
                res.send({ data: 'OK' })
            } else {
                res.send({ data: 'action failed' })
            }
        }
    })
})

app.post('/login', (req, res) => {
    let { username, password } = req.body;
    User.findOne({ username }, (err, doc) => {
        console.log(doc)
        if (!err && doc) {
            let { active, password: docPass } = doc
            if (active) {
                if (password == docPass) {
                    res.status(200).json({ data: 'OK' })
                }
            } else {
                res.status(200).json({ data: 'not active' })
            }
        } else
            res.status(200).json({ data: `login failed ${err}` })
    })
})

// /abc require login. lần đầu vào check chưa login redirect đến login. login xong
// lần 2 đã login và /abc check đã login vào luôn /abc mà ko redirect qua /login
app.get('/abc', (res, req) => {

})
app.listen(3030, () => {
    console.log("app running")
})

