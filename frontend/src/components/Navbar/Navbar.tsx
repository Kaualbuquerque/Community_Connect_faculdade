"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useTheme } from "@/context/ThemeContext";

import Button from "../Button/Button";
import ThemeButton from "../themeButton/ThemeButton";

import styles from "./Navbar.module.scss";

import logoLight from "@/icons/logo/community_connect_logo_light.png";
import logoDark from "@/icons/logo/community_connect_logo_dark.png";

export default function Navbar() {
    const { theme } = useTheme();
    const pathname = usePathname();
    const isHome = pathname === "/";

    const logo = theme === "light" ? logoDark : logoLight;
    const logoAlt =
        theme === "light"
            ? "Community Connect logo - modo claro"
            : "Community Connect logo - modo escuro";

    return (
        <header className={styles.navbar}>
            <div className={styles.title}>
                <Link href="/" aria-label="Página inicial do Community Connect">
                    <Image src={logo} alt={logoAlt} priority />
                </Link>
                <h1>
                    <Link href="/">Community Connect</Link>
                </h1>
            </div>

            <div className={styles.buttons}>
                {isHome && (
                    <div className={styles.authButtons}>
                        <Button text="Login" type="primary" href="/auth/login" />
                        <Button text="Cadastrar" type="secondary" href="/auth/register" />
                    </div>
                )}
                <ThemeButton />
            </div>
        </header>
    );
}
