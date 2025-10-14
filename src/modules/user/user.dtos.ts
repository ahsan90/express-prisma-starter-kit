// User type definitions
export interface UserDTO {
    id: number;
    email: string;
    name: string | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDTO {
    email: string;
    name?: string;
    password: string;
    isActive?: boolean;
}

export interface UpdateUserDTO {
    email?: string;
    name?: string;
    password?: string;
    isActive?: boolean;
}
