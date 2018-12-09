export default (app) => {
    app.route("/api/login")
        .post(function (req,res) {
            var resbody=req.body;
            console.log("request bodyF",resbody)
            res.json(resbody);

        }).get(function (req,res) {
            console.log("get called");
        res.json({"name":"zadiki"})
    })
}