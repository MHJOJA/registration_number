let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
const RegNumbers = require('./regNumbers');


let app = express();

const pg = require('pg')
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgressql://codex:pg123@localhost:5432/my_registrations';

const pool = new Pool({
    connectionString,
});

process.env.PORT;
process.env.DATABASE_URL;

let regNumbers = RegNumbers(pool);

app.use(express.static('public'))

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))
app.set(bodyParser.json())

app.use(
    session({
        secret: "<add a secret string here>",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());



app.get('/', async function (req, res) {
// console.log('get  route');
    const reg_numbers = await regNumbers.getRegNumbers();

    console.log({reg_numbers});

    res.render('home', {
        numberplates: reg_numbers

    })
});


app.post('/', async function (req, res) {
    var plates = req.body.registration_no;
    console.log(plates);
    var d = await regNumbers.duplicates(plates)
    // console.log('post route');
    if (plates === "") {
        req.flash('info', 'enter a registration number')
        
    }
    else if(plates === 0) {
        req.flash('success', 'you have entered a correct ragistratiion number');

    }
     else if (d ===1) {
        req.flash('info', 'numberplate already exists')

    } 
    // else if(!(/C[AYJ] \d{3,5}$/.test(plates)) || (!(/[a-zA-Z]/.test(plates)))) {
    //     req.flash('enter correct number')
    // }
   
   
    else {
         await regNumbers.insertRegNumbers(plates)

    }

    

    // console.log(isAdded);

    

    const numberplates = await regNumbers.getRegNumbers() || [];
    console.log({ numberplates });
    console.log(' after insert and result');

    res.render('home', {
        numberplates
    })


})

app.post('/filtering', async function(req,res){

var towns = req.body.townSelection;
var filter = await regNumbers.filter(towns);
console.log(filter);

if(towns == 'All'){

}

res.render('home',{
    numberplates: filter,
});

});


app.get("/reset", async function (req, res) {
    await regNumbers.reset();
    req.flash("success", "number-plate has been cleared");
    res.redirect("/");
});

const PORT = process.env.PORT || 3017
app.listen(PORT, function () {
    console.log('app started at port: ', PORT)
})