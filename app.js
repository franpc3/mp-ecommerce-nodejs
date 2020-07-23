var express = require('express');
var exphbs  = require('express-handlebars');
var mercadopago = require('mercadopago') ;
require('dotenv').config();
 
var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/success', function (req, res) {
    res.render('success', req.query);
});

app.get('/pending', function (req, res) {
    res.render('pending');
});

app.get('/failure', function (req, res) {
    res.render('failure');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.post('/checkout', async function (req,res)  {

    console.log(req.query);
    
        let preference = {
            items: [
                {   id: 1234,
                    title: req.query.titulo,
                    description: "Esta es una descripcion",
                    unit_price: parseInt(req.query.unit_price),
                    quantity: 1,
                    picture_url: "https://samsungar.vtexassets.com/arquivos/ids/162059-800-auto?width=800&height=auto&aspect=true",
                    


                    
                }
            ],
            external_reference: "franciscopc3@gmail.com",
            payer: {
                name: 'Lalo',
                surname: 'Landa',
                email: 'test_user_63274575@testuser.com',
                phone: {
                    area_code: "11",
                    number: 22223333  
                },
                address: {
                    street_name: 'False',
                    street_number: 123,
                    zip_code: "1111"
                }
            },
            payment_methods: {
                excluded_payment_methods: [
                    {
                        id: "amex"
                    }
                ],
                excluded_payment_types: [
                    {
                        id: "atm"
                    }
                ],
                installments: 6,
            },

            back_urls: {
                success: "https://franpc3-mp-ecommerce-nodejs.herokuapp.com/success",
                pending: "https://franpc3-mp-ecommerce-nodejs.herokuapp.com/pending",
                failure: "https://franpc3-mp-ecommerce-nodejs.herokuapp.com/failure"
            },
            auto_return: "approved",
           
        };
    
        mercadopago.preferences.create(preference)
            .then(function (response) {
                // Este valor reemplazará el string "$$init_point$$" en tu HTML
                res.redirect(response.body.init_point);
            }).catch(function (err) {
               console.log(err);
            });
     
    
} )

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(process.env.PORT || 3000);

mercadopago.configure({
    access_token: process.env.MP_TOKEN,
    integrator_id: process.env.INTEGRATOR_ID
  });
  
