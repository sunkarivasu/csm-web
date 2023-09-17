const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');


// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());


// Configuration
dotenv.config();
require('./config/db');
require("./config/passport_jwt")(passport);


// Constants
const PORT = process.env.PORT || 3333;


// Routes
app.use(express.static('public'));
app.get('/', (req, res) => res.json({ msg: "Hello World" }));
app.use("/api/admins", require("./routes/admin"));
app.use("/api/user", require("./routes/user"));
app.use("/api/product", require("./routes/product"));
app.use("/api/categories", require("./routes/category"));
app.use('/api/sub-category', require('./routes/sub_category'));


// Server
app.listen(PORT, () => console.log(`[server]: Server running @${PORT}`));