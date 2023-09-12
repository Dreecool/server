const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const secretKey = "ADASDASDASDASDLASLDKASLD";
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs")
const PORT = 3001;

mongoose.connect("mongodb+srv://francesdonaire:chatforte123456@chat-forte-db.xnufm5f.mongodb.net/chat-forte?retryWrites=true&w=majority", {
  useNewUrlParser: true,
});

const Register = require("./model/register");

app.use(
  cors({
    origin: ["https://front-end-chat-nine.vercel.app"],
    methods: ["POST, GET, DELETE, PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));



app.post("/registerUser", async (req, res) => {
  const full_name = req.body.full_name;
  const email_address = req.body.email_address;
  const password = req.body.password;

  try {

    const saltRounds = 10; 

   
    const hash = await bcrypt.hash(password, saltRounds);

    const RegisterUser = new Register({
      full_name: full_name,
      email_address: email_address,
      password: hash, 
    });

    await RegisterUser.save();
    console.log("success");

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});



app.post("/loginUser", async (req, res) => {
  const email_address = req.body.email_address;
  const password = req.body.password;


  try {
    const existingUser = await Register.findOne({ email_address });

    

    if (existingUser) {
      const storedHash = existingUser.password;


      // Compare the provided password with the stored hash

      const isPasswordValid = await bcrypt.compare(password, storedHash);
     


      if (isPasswordValid) {
        
        const userId = existingUser._id;
        const token = jwt.sign({ userId }, secretKey, { expiresIn: "1d" });
   
        res.status(200).json(token);

      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Email not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

const verifyUser = (req, res, next) => {

  const token = req.cookies.token;



  
  if (!token) {
    return res.json({ message: 'Unauthorized' });
  } else {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.json({ message: "Token is not valid" });
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  }
};

app.get("/LoggedIn", verifyUser, (req, res) => {
  return res.json({ Message: "Authorized" });
});

app.listen(PORT, () => {
  console.log("PORT IS LISTENING AT 3001");
});

