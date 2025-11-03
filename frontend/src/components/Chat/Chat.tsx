"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./Chat.module.scss";
import { ChatProps } from "@/utils/interfaces";
import trash from "@/icons/others/trash.png";
import { deleteConversation } from "@/services/conversation";


export default function Chat({ id, provider, date, onDelete }: ChatProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar esta conversa?")) return;

    try {
      setLoading(true);
      await deleteConversation(id);

      // 🔹 Atualiza lista no componente pai sem recarregar a página
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error("Erro ao deletar conversa:", err);
      alert("Não foi possível deletar a conversa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className={styles.chat}>
      <Link href={`/dashboard/chats/${id}`} aria-label={`Abrir chat com ${provider}`}>
        <h3>{provider}</h3>
        <time dateTime={date} className={styles.date}>
          {date}
        </time>
      </Link>

      <button
        onClick={handleDelete}
        disabled={loading}
        className={styles.deleteButton}
        aria-label="Deletar conversa"
      >
        <Image src={trash} alt="Deletar" width={16} height={16} />
      </button>
    </article>
  );
}
