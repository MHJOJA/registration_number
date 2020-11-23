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
console.log('get  route');
    
    const reg_numbers = await regNumbers.getRegNumbers();

    console.log({reg_numbers});

    res.render('home', {
        numberplates: reg_numbers

    })
});


app.post('/', async function (req, res) {
    var plates = req.body.registration_no;

    console.log('post route');
    if (plates === "") {
        req.flash('info', 'enter a registration number')
    }

    
    const isAdded = await regNumbers.insertRegNumbers(plates)

    console.log(isAdded);

    if(isAdded) {
        req.flash('success', 'you have entered a correct ragistratiion numbert');

    }

    const numberplates = await regNumbers.getRegNumbers() || [];
    console.log({ numberplates });
    console.log(' after insert and result');

    res.render('home', {
        numberplates
    })

    
})


app.get("/reset", async function (req, res) {
    await regNumbers.reset();
    req.flash("success", "number-plate has been cleared");
    res.redirect("/");
});

const PORT = process.env.PORT || 3017
app.listen(PORT, function () {
    console.log('app started at port: ', PORT)
})