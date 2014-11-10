exports.index = function(req, res){
    res.render('mfLayout');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    console.log(req.params);
    res.render('partials/' + name);
};