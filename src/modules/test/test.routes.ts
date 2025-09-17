import { Router } from 'express';
import { testController } from './test.controller';

const router = Router();

router.use('/tests', testController.router);

export { router as testRoutes };