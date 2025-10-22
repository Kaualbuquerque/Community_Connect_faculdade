"use client";

import { NoteModalProps } from "@/utils/interfaces";
import Button from "../Button/Button";
import Input from "../Input/Input";

import styles from "./NoteModal.module.scss";

export default function NoteModal({ onClose }: NoteModalProps) {

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
          />
        </div>

        <div className={styles.buttons}>
        <Button text="Cancel" type="secondary" handleFunction={onClose} />
          <Button text="Save" type="primary" handleFunction={onClose}/>
        </div>
      </div>
    </div>
  );
}
