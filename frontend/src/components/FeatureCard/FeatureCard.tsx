"use client";

import Image from "next/image";

import { FeatureCardProps } from "@/utils/interfaces";

import styles from "./FeatureCard.module.scss";

export default function FeatureCard({ icon, text }: FeatureCardProps) {

    return (
        <article className={styles.featureCard}>
            <Image src={icon} alt={text} width={32} height={32} />
            <p>{text}</p>
        </article>
    );
}
