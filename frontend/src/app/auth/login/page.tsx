"use client";

import LoginForm from "@/components/LoginForm/LoginForm";
import styles from "./page.module.scss";

export default function LoginPage() {
    return (
        <main className={styles.loginPage} aria-label="Página de login">
            <LoginForm />
        </main>
    );
}
