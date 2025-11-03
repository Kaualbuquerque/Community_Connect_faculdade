"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useTheme } from "@/context/ThemeContext";
import { loginUser } from "@/services/auth";

import Input from "../Input/Input";
import Button from "../Button/Button";

import styles from "./LoginForm.module.scss";

import logoLight from "@/icons/logo/community_connect_logo_light.png";
import logoDark from "@/icons/logo/community_connect_logo_dark.png";
import { LoginFormState } from "@/utils/interfaces";


export default function LoginForm() {
    const { theme } = useTheme();
    const router = useRouter();

    const [form, setForm] = useState<LoginFormState>({
        email: "",
        password: "",
    });
    const [errorMsg, setErrorMsg] = useState("");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await loginUser(form);

            const { access_token, user } = response;
            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));

            router.push("/dashboard");
        } catch (error: any) {
            setErrorMsg(error?.message || "Email ou senha inválidos.");
        }
    };

    const logo = theme === "light" ? logoDark : logoLight;
    const logoAlt = theme === "light" ? "Community Connect logo - modo claro" : "Community Connect logo - modo escuro";

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
            <header className={styles.logo}>
                <Image src={logo} alt={logoAlt} />
                <h3>Community Connect</h3>
            </header>

            <h2>Login</h2>

            <Input
                label="Email:"
                type="email"
                name="email"
                placeholder="Seu@email.com"
                required
                value={form.email}
                onChange={handleInputChange}
            />

            <Input
                label="Senha:"
                type="password"
                name="password"
                placeholder="Sua senha"
                required
                minLength={6}
                maxLength={12}
                value={form.password}
                onChange={handleInputChange}
            />

            {errorMsg && <p className={styles.error}>{errorMsg}</p>}

            <div className={styles.buttons}>
                <Button text="Login" type="primary" />
            </div>
        </form>
    );
}
