import { Request, Response, NextFunction, Router } from 'express';
import { userService } from './user.service';

class UserController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/hello', this.hello);
    }

    private async hello(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await userService.hello();
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();
