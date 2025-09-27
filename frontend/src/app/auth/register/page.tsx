"use client";

import RegisterForm from "@/components/RegisterForm/RegisterForm";
import styles from "./page.module.scss";

export default function RegisterPage() {
    return (
        <main className={styles.registerPage} aria-label="Página de cadastro">
            <RegisterForm />
        </main>
    );
}
