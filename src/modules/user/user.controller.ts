import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';

export class UserController {
    // Get all users
    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await userService.getAllUsers();
            res.json({
                success: true,
                data: users,
            });
        } catch (error) {
            next(error);
        }
    };

    // Get user by ID
    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(parseInt(id));

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    };

    // Create a new user
    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.body;
            const user = await userService.createUser(userData);

            res.status(201).json({
                success: true,
                data: user,
                message: 'User created successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    // Update a user
    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const userData = req.body;
            const user = await userService.updateUser(parseInt(id), userData);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            res.json({
                success: true,
                data: user,
                message: 'User updated successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    // Delete a user
    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await userService.deleteUser(parseInt(id));

            res.json({
                success: true,
                message: 'User deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    };
}

export const userController = new UserController();
