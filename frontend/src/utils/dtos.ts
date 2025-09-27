export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "consumer" | "provider";
    cep: string;
    state: string;
    city: string;
    number: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}