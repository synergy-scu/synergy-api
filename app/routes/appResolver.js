import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Synergy API is Healthy');
});

export default router;
