let express = require(`express`);
let app = express();
let cors = require('cors')
let port = 3000;
app.listen(port, function () {
    console.log(`Сервер запущен: http://localhost:${port}`)
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json())
app.use(express.static('public'));


let mongoose = require('mongoose');
const { name } = require('dayjs/locale/ru');
mongoose.connect('mongodb://127.0.0.1:27017/sneakershop');

// схема
let schema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    brand: String,
    inCart: Boolean,
    checked: Boolean
});

let ordersSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    total: Number,
    order: {
        type: String,
        required: true
    },
})

let Sneaker = mongoose.model('sneaker', schema);

let Order = mongoose.model('order', ordersSchema);

app.get(`/sneakers`, async function(req, res){

    let data = await Sneaker.find();

    res.send(data);
})

app.put(`/sneakers`, async function (req, res) {
    let id = req.body.id;
    let sneaker = await Sneaker.findOne({_id:id});
    sneaker.inCart = !sneaker.inCart;
    sneaker.checked = false;

    await sneaker.save();
})

app.get(`/buyed`, async function(req, res){

    let data = await Sneaker.find({inCart: true});

    res.send(data);
})

app.get('/orders', async function(req, res){

    let data = await Order.find();

    res.send(data);
})

app.post('/orders', async function(req,res){
    let username = req.body.username;
    let city = req.body.city;
    let sum = Number(req.body.sum);
    let titles = req.body.titles;

    let order = new Order({
        to: username,
        total: sum,
        city: city,
        order: titles
    })

    try{
        await order.save();
        res.sendStatus(201);
    } catch(error) {
        res.sendStatus(400);
    }
})