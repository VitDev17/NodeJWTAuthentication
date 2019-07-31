//Authentication route
const router = require('express').Router();
const verifyToken = require('./verifyToken');

router.get('/',verifyToken, async(req,res) => {
    //retrieve posts from db
    /* res.json({
        posts: {
            title: 'myfirst post',description: 'ciao ciao ciao'
        },
    }); */
    res.send(req.user);
});

module.exports = router;