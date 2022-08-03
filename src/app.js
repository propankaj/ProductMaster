require("dotenv").config(); 
const express = require("express"); 
const app = express(); 
const path = require("path"); 
const cookieParser = require("cookie-parser"); 
const auth = require("./middlewares/auth"); 
const multer  = require('multer');
const exphbs = require("express-handlebars")
 
require("./db/conn"); 
 
const Login = require('./models/login');
const Product = require('./models/product');
const port = process.env.PORT || 4000; 
 
const static_path = path.join(__dirname, "../public");
const view_path = path.join(__dirname, "../views");
 
app.use(express.static(static_path)); 
app.set("view engine", "hbs"); 
app.set("views", view_path); 
 
app.use(express.json()); 
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: false }));
app.use("/upload", express.static(__dirname + '/Images'));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "Images"))
      },
      filename: function(req, file, cb) {
        console.log("file", file)
        fileExtension = file.originalname.split(".")[1]
        cb(null, file.fieldname + "." + fileExtension)
      },
})
  
const upload = multer({ storage: storage });

app.get("/upload", (req, res) => {
    res.render("imageUpload")
  })
app.post("/upload", upload.single("image"), (req, res) => {
    let uploadedfile = req.file.fieldname
    console.log("uplodedededede"+ uploadedfile)
    if (uploadedfile) {
        res.redirect('/listProduct');
    //   res.send("file uploaded successfully")
    }else{
        res.send("Please select File")
    }
})

app.get("/", (req, res) => { 
    res.render("login"); 
}) 
app.get("/productDetails", (req, res) => { 
    res.render("productDetail"); 
}) 
app.get("/login", (req, res) => { 
    res.render("login"); 
}) 
 
app.post("/login", async (req, res) => { 
    try {
        const user = await Login.loginCheck(req);
 
        console.log("userMail ==> ", JSON.stringify(user))
 
        if (user.rows[0].user == 0) {
            res.send("Invalid login details"); 
        } 
        else {
            const token = await Login.genetrateAuthToken(req);
            await Login.saveToken(token, req);
            console.log("token here" + token)
            res.cookie("jwt", token, { 
                exprires: new Date(Date.now() + 60000), 
                httpOnly: true, 
            }); 
            res.redirect('/listProduct');
        } 
    } 
    catch (err) {
        console.log(err) 
        res.status(400).send("Invalid login details"); 
    } 
}) 
app.get("/addProduct", async (req, res) => {
    try {
        // await Product.add(req);
        // res.status(200).send('Product Added');
        res.render("addproduct");

    } catch (error) {
        console.log(error)
    }
})
app.post("/addProduct", async (req, res) => {
    try {
        await Product.add(req);
        // res.status(200).send('Product Added');
        // if (res.status(200)) {
        res.redirect('/listProduct');
        // }
    } catch (error) {
        res.send('Something went wrong');
        console.log(error)
    }
})
app.get("/updateProduct/:id", async (req, res) => {
    try {
        let list = await Product.getproductData(req);
        res.render("updateProduct", { "data": list.rows })
        // res.status(200).send('Product Update');
    } catch (error) {
        console.log(error)
    }
})
app.post("/updateProduct/:id", async (req, res) => {
    try {
        await Product.update(req);
        // res.status(200).send('Product Update');
        res.redirect('/listProduct');
    } catch (error) {
        console.log(error)
    }
})
app.get("/deleteProduct/:id", async (req, res) => {
    try {
        await Product.delete(req);
        // res.status(200).send('deleted')
        // const list = await Product.list(req);
        res.redirect('/listProduct');
    } catch (error) {
        console.log(error)
    }
})
app.get("/listProduct", async (req, res) => {
    try {
        const list = await Product.list(req);
        // res.status(200).send(list.rows)

        res.render("productDetail", { "data": list.rows })

    } catch (error) {
        console.log(error)
    } 
}) 
 
app.listen(port, () => { 
    console.log(`Server is listing at port ${port}`); 
}) 

