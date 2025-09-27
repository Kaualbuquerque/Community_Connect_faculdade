import { ChangeEvent } from "react";

// Button
export interface ButtonProps {
    text: string,
    type: string,
    href?: string;
    handleFunction?: () => void;
    icon?: any;
    disabled?: boolean;
}

// Card
export interface FeatureCardProps {
    icon: string;
    text: string;
}

export interface ServiceCardProps {
    image: string;
    title: string;
    description: string;
}

// Input
export type InputType = "text" | "number" | "password" | "email" | "radio";

export interface InputProps {
    id?: string;
    type?: InputType;
    label?: string;
    placeholder?: string;
    value?: string | number;
    name?: string;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}