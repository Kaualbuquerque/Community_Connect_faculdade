import Link from "next/link";
import Image from "next/image";

import styles from "./Button.module.scss";
import { ButtonProps } from "@/utils/interfaces";

export default function Button({
    text,
    type,
    href,
    handleFunction,
    icon,
    disabled,
}: ButtonProps) {
    const button = (
        <button
            className={`${styles.button} ${styles[type]}`}
            onClick={handleFunction}
            disabled={disabled}
        >
            {text}
            {icon && <Image src={icon} alt="" />}
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
