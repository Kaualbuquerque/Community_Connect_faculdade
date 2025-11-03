"use client";

import { useTheme } from "@/context/ThemeContext";
import styles from "./ThemeButton.module.scss";
import Image from "next/image";
import sun from "@/icons/theme/sun.png";
import moon from "@/icons/theme/moon.png";

export default function ThemeButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div
            className={`${styles.button} ${theme === "dark" ? styles.primary : styles.secondary}`}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
        >
            <Image
                src={theme === "dark" ? moon : sun}
                alt={theme === "dark" ? "Ícone da lua" : "Ícone do sol"}
                width={24}
                height={24}
            />
        </div>
    );
}
