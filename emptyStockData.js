var db = require('./src/db/conn');

module.exports.emptyStock = async function () {
    try {
        // console.log("req body for emptyStock----",req.body)
        let query = "select * from products where stock = ?";  
        let values = ['0'];
        return await db.execQuery(query, values);
    } catch (error) {
        console.log(error);
    }
}