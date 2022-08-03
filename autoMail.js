const nodemailer = require("nodemailer");
const cron = require('node-cron');
const emptyStock = require('./emptyStockData')
module.exports.scheduler = async function () {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            // secure: true,
            auth: {
                user: 'pankajsg12@gmail.com',
                pass: 'wzxbsnmbvmmknvgz',
            },
        });

        let info = {
            from: 'pankajsg12@gmail.com',
            to: "pankajsg24@gmail.com", 
            subject: "Product Out of stock", 
            text: "Products is out of stock.", 
        };

        cron.schedule('0 0 */1 * * *', async () => {
            let stockData = await emptyStock.emptyStock();
            console.log("stockdatadatadat" + JSON.stringify(stockData))
            if (stockData && stockData.rows && stockData.rows.length) {
                transporter.sendMail(info, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Mail Send : ' + info.response);
                    }
                });
            } else {
                console.log("all stock is full")
            }
        })
    } catch (error) {
        console.log("catch scheduler error " + error)
    }
}
module.exports.scheduler();