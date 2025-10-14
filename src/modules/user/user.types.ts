// User type definitions (can be extended as needed)
import { User, NewUser } from '../../db/schema';

export type { User, NewUser };

export interface UserQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}

export interface UserResponse {
    success: boolean;
    data?: User | User[];
    message?: string;
}
