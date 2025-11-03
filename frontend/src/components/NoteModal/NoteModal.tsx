"use client";

import { useState } from "react";

import Button from "../Button/Button";
import Input from "../Input/Input";

import styles from "./NoteModal.module.scss";
import { CreateNoteDTO, NoteModalProps, Notes } from "@/utils/interfaces";
import { createNote } from "@/services/note";

export default function NoteModal({ onClose }: NoteModalProps) {
  const date = Date;

  const [form, setForm] = useState<CreateNoteDTO>({
    content: "",
    date: date.toString(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateNote = async () => {
    if (!form.content.trim()) return;

    try {
      const payload: CreateNoteDTO = {
        content: form.content,
        date: form.date,
      }

      await createNote(payload);
      alert("Nota criada com sucesso!.")
      onClose(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar nota.")
    }
  };


  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <h3 id="modal-title">Adicionar uma nova nota</h3>

        <div className={styles.inputs}>
          <Input
            type="textarea"
            name="content"
            label="O que quero lembrar?"
            placeholder="Escreva sua nota aqui..."
            required
            maxLength={400}
            value={form.content}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.buttons}>
          <Button text="Cancel" type="secondary" handleFunction={onClose} />
          <Button text="Save" type="primary" handleFunction={handleCreateNote} />
        </div>
      </div>
    </div>
  );
}
