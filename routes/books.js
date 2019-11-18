const router = require('express').Router();
const model = require('../db').books;
const passport = require('../auth');

router.get('/test', (req, res) => {
    res.sendStatus(418);
});

router.get('/getAll', (req, res) => {
    model.find((err, result) => res.json(result));
});

router.get('/get/:id', (req, res) => {
    model.findById(req.params.id, (err, result) => {
        if (err) {
            console.warn(err);
            res.sendStatus(400);
        }
        res.json(result);
    }).catch(err => console.warn(err));
})

router.get('/search/:search', (req, res) => {
    model.find().or([{
        title: {
            '$regex': req.params.search
        }
    },
    {
        author: {
            '$regex': req.params.search
        }
    }
    ]).then(results => res.json(results)).catch(err => console.warn(err))
});

router.get('/featured', (req, res) => {
    model.findOne({ featured: true }, (err, result) => {
        if (err) {
            console.error(err);
        }
        res.json(result);
    })
})

module.exports = router;