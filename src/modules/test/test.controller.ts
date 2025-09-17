import { Request, Response, NextFunction, Router } from 'express';
import { testService } from './test.service';


class TestController {
    public router: Router;
    
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.getAllTests);
        this.router.get('/:id', this.getTestById);
        this.router.post('/', this.createTest);
        this.router.put('/:id', this.updateTest);
        this.router.delete('/:id', this.deleteTest);
    }

    private async getAllTests(req: Request, res: Response, next: NextFunction) {
        try {
            const tests = await testService.getAllTests();
            res.json(tests);
        } catch (error) {
            next(error);
        }
    }

    private async getTestById(req: Request, res: Response, next: NextFunction) {
        try {
            const test = await testService.getTestById(req.params.id);
            res.json(test);
        } catch (error) {
            next(error);
        }
    }

    private async createTest(req: Request, res: Response, next: NextFunction) {
        try {
            const newTest = await testService.createTest(req.body);
            res.status(201).json(newTest);
        } catch (error) {
            next(error);
        }
    }

    private async updateTest(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedTest = await testService.updateTest(req.params.id, req.body);
            res.json(updatedTest);
        } catch (error) {
            next(error);
        }
    }

    private async deleteTest(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await testService.deleteTest(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const testController = new TestController();