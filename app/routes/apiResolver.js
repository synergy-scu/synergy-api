import express from 'express';

import loginRouter from './routers/login';
import userRouter from './routers/users';

import groupRouter from './routers/groups';
import deviceRouter from './routers/devices';
import channelRouter from './routers/channels';

import usageRouter from './routers/usages';
import chartRouter from './routers/charts';

const router = express.Router();

router.use('/login', loginRouter);
router.use('/user', userRouter);

router.use('/group', groupRouter);
router.use('/device', deviceRouter);
router.use('/channel', channelRouter);

router.use('/usage', usageRouter);
router.use('/chart', chartRouter);

export default router;
