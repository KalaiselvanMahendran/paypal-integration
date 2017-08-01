var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': '************************************',
  'client_secret': '****************************************'
});

module.exports = function(router) {

    router.get('/', function(req, res){
        res.render('index.ejs', {title: "Express"});
    });

    router.get('/create', function(req, res){
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/#!/success",
                "cancel_url": "http://localhost:3000/#!/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "item",
                        "sku": "item",
                        "price": "1.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "1.00"
                },
                "description": "This is the payment description."
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                if(payment.payer.payment_method === 'paypal') {
                    req.session.paymentId = payment.id;
                    var redirectUrl;
                    for(var i=0; i < payment.links.length; i++) {
                        var link = payment.links[i];
                        if (link.method === 'REDIRECT') {
                            redirectUrl = link.href;
                        }
                    }
                    res.json({success: true, url: redirectUrl});
                }
            }
        });

    });

    router.get('/execute', function(req, res){
        var paymentId = req.session.paymentId;
        var payerId = req.param('PayerID');

        var details = { "payer_id": payerId };
        paypal.payment.execute(paymentId, details, function (error, payment) {
            if (error) {
                console.log(error);
                res.json({success: false, msg: error.stack});
            }
            else {
                res.json({success: true, msg: "Hell yeah!", paymentDetails: payment});
            }
        });
    })

    router.get('/cancel', function(req, res){
        res.json({success: false, msg: "The payment got canceled"});
    })
}
