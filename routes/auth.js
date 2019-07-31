//Authentication route
const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { registerValidation } = require('../validation');
const { loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');



router.post('/register', async(req,res) => {
    //VALIDATE THE USER BEFORE WE SAVE A USER
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if data are already in the database
    const EmailExists = await User.findOne({email: req.body.email});
    if(EmailExists) return res.status(400).send('Email already exists');

    //IF EVERYTHING IS OK
    //Hash the password
    const salt = await bcrypt.genSalt(10); //gentSalt need to be passed the copmplexity of the hashing method
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //create a new user after data are being validated
    const user = new User({
        id: req.body,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error) {
        res.status(400).send(err);
    }
    
});

router.post('/login', async (req,res) => {
    //VALIDATE THE USER BEFORE WE LOGIN A USER
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if data are already in the database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Email doesn't exists");
    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid password");

    //create token from validPass
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token'. token).send(token);


    res.send('Login succesful');

});


module.exports = router;
