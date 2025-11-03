import { NoteProps } from "@/utils/interfaces";

import styles from "./Note.module.scss";
import Button from "../Button/Button";

export default function Note({ content, date, onDelete }: NoteProps) {
    const formattedDate = date
        ? new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Sem data";

    return (
        <article className={styles.note}>
            <div className={styles.text}>
                <p>{content}</p>
                <time className={styles.date}>{formattedDate}</time>
            </div>

            <div className={styles.actions}>
                <Button
                    type="alert"
                    handleFunction={onDelete}
                    text="Deletar nota"
                />
            </div>
        </article>
    );
}