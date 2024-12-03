const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { DBConnection } = require("./config/DB");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const ApiError = require("./utils/apiError");
const authRoutes = require("./routes/authRoute")
const productsRoute = require("./routes/productRoute")
const path = require("path")
DBConnection()

dotenv.config()

app.use(
    cors({
        origin: [process.env.CLIENT_URL],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    })
);


// middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"))
    console.log(`mode : ${process.env.NODE_ENV}`)
}

app.use( express.static(path.join(__dirname, "uploads")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/products', productsRoute)


app.all("*", (req, res, next) => {
    next(ApiError("can't find this route"), 404)
})

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'Error'
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
    })
    next()
    
});

const port = process.env.PORT
app.listen(port, () => {
    console.log(`App listen on port ${port}`);
})