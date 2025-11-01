"use client"

import { useEffect, useRef, useState } from "react";
import styles from "./Message.module.scss"
import { MessageProps } from "@/utils/interfaces";

export default function Message({ text, type }: MessageProps) {

    const [expanded, setExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const pRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (pRef.current) {
            const isOverflowing = pRef.current.scrollHeight > pRef.current.clientHeight;
            setShowReadMore(isOverflowing);
        }
    }, [expanded, text]);

    const handleReadMore = () => setExpanded(true);

    return (
        <div className={`${styles.message} ${styles[type]}`}>
            <p ref={pRef} className={expanded ? styles.expanded : ""}>
                {text}
            </p>
            {!expanded && showReadMore && (
                <span className={styles.readMore} onClick={handleReadMore}>
                    Ler mais
                </span>
            )}
        </div>
    )
}