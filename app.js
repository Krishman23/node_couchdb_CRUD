var express = require('express');
var routes = require ('./routes');
var http = require ('http');
var path = require ('path');
var urlencoded = require ('url');
var bodyParser = require ('body-parser');
var json = require ('json');
var logger = require ('logger');
var methodOverride = require ('method-override');


var nano = require ('nano')('http://127.0.0.1:5984');


var db = nano.use('address');
var app = express();


app.set('port', process.env.PORT || 3000);
console.log(path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));
//app.set('view_engine','jade');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(__dirname,'public')));

app.get('/',routes.index);

app.post('/createdb', function(req,res){
    console.log(req.body.dbname);
    nano.db.create(req.body.dbname, function(err){
        
        if(err){
            console.log(err);
            res.send("error creating db: "+err+ req.body.dbname);
            return;
        }
        res.send("DB "+req.body.dbname+ " created.");

    });
});

app.post('/new_contact',function(req,res){
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    db.insert({name:name, phone:phone, email:email, crazy:true},phone, function(err,body,header){
        if(err){
            console.log(err);
            res.send("error creating contact");
            return;
        }
        res.send("Contact  "+name+ " created.");
    });
});


app.post('/view_contact', function(req,res){
    var alldoc = "Following are the contacts";
    db.get(req.body.phone,{revs_info:true},function(err,body){
        if(!err){
            console.log(body);
        }
        else{
            console.log(err);
        }
        if(body){
            alldoc+= "Name :"+body.name +"<br/>Phone :"+ body.phone+"<br/>Email :"+ body.email;
        }
        else{
            alldoc= "No records found"
        }
        res.send(alldoc);
    });
});

app.post('/delete_contact',function(req,res){
    db.get(req.body.phone, {revs_info:true},function(err,body){
        if(!err){
           db.destroy(req.body.phone,body._rev, function(err,body){
            if(err){
                res.send("error del contacts");
            }
           })
        }
        res.send("Contact deleted");
    });

});
http.createServer(app).listen(app.get('port'),function(){
    console.log('Express server listening on port'+app.get('port'));
})