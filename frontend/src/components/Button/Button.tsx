import Link from "next/link";

import styles from "./Button.module.scss";
import { ButtonProps } from "@/utils/interfaces";

export default function Button({
    text,
    type,
    href,
    handleFunction,
}: ButtonProps) {
    const button = (
        <button
            className={`${styles.button} ${styles[type]}`}
            onClick={handleFunction}
        >
            {text}
        </button>
    );

    return href ? (
        <Link href={href} className={styles.link}>
            {button}
        </Link>
    ) : (
        button
    );
}
