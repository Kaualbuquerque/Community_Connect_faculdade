"use client";

import Image from "next/image";

import { useTheme } from "@/context/ThemeContext";
import { FeatureCardProps } from "@/utils/interfaces";

import styles from "./FeatureCard.module.scss";

export default function FeatureCard({ iconLight, iconDark, text }: FeatureCardProps) {
    const { theme } = useTheme();
    const icon = theme === "dark" ? iconDark : iconLight;

    return (
        <article className={styles.featureCard}>
            <Image src={icon} alt={text} width={32} height={32} />
            <p>{text}</p>
        </article>
    );
}
