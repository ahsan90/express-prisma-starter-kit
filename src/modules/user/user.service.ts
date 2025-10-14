export class UserService {
    public hello = async () => {
        return { message: 'Hello from User service' };
    }
}

export const userService = new UserService();
