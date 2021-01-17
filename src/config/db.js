const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017:/users`, {
    useUnifiedTopology: true,
    useNewUrlParser: true, 
    useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {console.log("connected to db")})
module.exports = db;