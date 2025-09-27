"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


import Input from "../Input/Input";
import Button from "../Button/Button";

import styles from "./LoginForm.module.scss";

import logo from "../../../public/icons/logo/community_connect_logo_dark.png";


export default function LoginForm() {
    return (
        <form className={styles.loginForm} noValidate>
            <header className={styles.logo}>
                <Image src={logo} alt="" />
                <h3>Community Connect</h3>
            </header>

            <h2>Login</h2>

            <Input
                label="Email:"
                type="email"
                name="email"
                placeholder="Seu@email.com"
                required
            />

            <Input
                label="Senha:"
                type="password"
                name="password"
                placeholder="Sua senha"
                required
                minLength={6}
                maxLength={12}
            />

            <div className={styles.buttons}>
                <Button text="Login" type="primary" />
            </div>
        </form>
    );
}
