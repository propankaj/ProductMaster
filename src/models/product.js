
var db = require('../db/conn');

module.exports.add = async function (req) {
    try {
        // console.log("req body for ADD----",req.body)
        let query = "insert into products (product_name, product_price, stock, product_description, product_image) values (?,?,?,?,?)";  
        let values = [req.body.productname,req.body.productprice,req.body.stock,req.body.productdescription,req.body.productimage];
        return await db.execQuery(query, values);
    } catch (error) {
        console.log(error);
    }
}

module.exports.getproductData = async function(req){
    try {
        let query = "select * from products where id = ?";  
        let values = [req.params.id];
        return await db.execQuery(query, values);
    } catch (error) {
        console.log(error);
    }
}

module.exports.update = async function(req){
    try {
        // console.log("req body for UPDATE----",req.body)
        let query = "update products set product_name = ?, product_price=?, stock=?, product_description=?, product_image=? where id = ?";  
        let values = [req.body.productname,req.body.productprice,req.body.stock,req.body.productdescription,req.body.productimage,req.params.id];
        return await db.execQuery(query, values);
    } catch (error) {
        console.log(error);
    }
}

module.exports.delete = async function (req) {
    try {
        // console.log("req body for DELETE----",req.params.id)
        let query = "delete from products where id = ?";  
        let values = [req.params.id];
        return await db.execQuery(query, values);
    } catch (error) {
        console.log(error);
    }
}

module.exports.list = async function (req) {
    try {
        let query = "select * from products order by id = ? asc";  
        let values = [req.params.id];
        return await db.execQuery(query, values);
    } catch (error) {
        console.log(error);
    }
}