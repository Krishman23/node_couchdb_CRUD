exports.create = function(req,res){
    nano.db.create(req.body.dbname, function(){
        if(err){
            res.send("Error creating the DB");
            return;
        }
        res.send("creating the DB successful");
    })
}