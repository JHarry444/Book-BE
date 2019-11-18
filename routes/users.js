const router = require('express').Router();
const User = require('../db').users;
const passport = require('../auth');
const { secret } = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');

router.get('/test', (req, res) => {
    res.sendStatus(418);
});

router.get('/getAll', (req, res) => {
    User.find((err, result) => res.json(result));
});

router.get('/get/:id', (req, res) => {
    User.findById(req.params.id).then(result => res.json(result)).catch(err => console.warn(err));
})

router.post('/register', ({ body: { username, password } }, res) => {
    User.register(new User({ 'username': username }), password, (err, user) => {
        if (err) {
            return res.sendStatus(400);
        }
        const token = jwt.sign({ id: user.id }, secret, {
            expiresIn: 60 * 60,
        });
        res.status(200).send({
            auth: true,
            token,
            message: 'user created & logged in',
            name: username
        });
    });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, secret, {
            expiresIn: 60 * 60,
        });
        res.status(200).send({
            auth: true,
            token,
            message: 'user found & logged in',
            name: req.user.username
        });
    });

router.get('/logout', function (req, res) {
    req.logout();
    res.sendStatus(200);
});

router.put('/update', (req, res) => {
    User.findByUsername(req.query.user)
        .then((user) => {
            user.setPassword(req.body.password, () => {
                user.save();
                res.sendStatus(200);
            });
        })
        .catch((err) => {
            res.sendStatus(400);
        });
}
);

router.delete('/remove/:id', (req, res) => {
    User.remove({ _id: req.params.id }).then(() => res.sendStatus(200)).catch(err => {
        console.warn(err);
        res.sendStatus(400);
    })
})

module.exports = router;