"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import Button from "../Button/Button";

import styles from "./Navbar.module.scss";

import logo from "../../../public/icons/logo/community_connect_logo_dark.png";

export default function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <header className={styles.navbar}>
            <div className={styles.title}>
                <Link href="/" aria-label="Página inicial do Community Connect">
                    <Image src={logo} alt="" priority />
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
            </div>
        </header>
    );
}
