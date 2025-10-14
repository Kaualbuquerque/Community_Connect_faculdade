"use client";

import { useState, useEffect } from "react";
import styles from "./ServiceModal.module.scss";

import Button from "../Button/Button";
import Input from "../Input/Input";
import { options } from "@/utils/options";
import { ServiceModalProps } from "@/utils/interfaces";

export default function ServiceModal({ isOpen, onClose, serviceData, onSubmit }: ServiceModalProps) {

    // Estado das imagens selecionadas no frontend
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    // Remove imagem selecionada do estado
    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, idx) => idx !== index));
    };

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
            <div className={styles.modal}>
                <h3 id="service-modal-title">{serviceData?.id ? "Editar Serviço" : "Criar Serviço"}</h3>

                <Input
                    label="Nome do serviço"
                    type="text"
                    name="name"
                    placeholder="Digite o nome do serviço"
                    required
                    maxLength={100}
                />

                <Input
                    label="Descrição"
                    type="textarea"
                    name="description"
                    placeholder="Digite a descrição do serviço"
                    required
                    maxLength={300}
                />

                <Input
                    label="Preço"
                    type="number"
                    name="price"
                    placeholder="Digite o valor do serviço"
                    required
                    maxLength={10}
                />

                <Input
                    label="Categoria"
                    type="select"
                    name="category"
                    placeholder="Selecione uma categoria"
                    required
                    options={options}
                />

                {/* Seção de upload de imagens */}
                <div className={styles.imageUpload}>
                    <label htmlFor="image-upload">Upload até 5 imagens:</label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                    />

                    <div className={styles.preview}>
                        {images.map((img, idx) => (
                            <div key={idx} className={styles.previewItem}>
                                <img src={URL.createObjectURL(img)} alt={`Preview ${idx + 1}`} />
                                <button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={() => handleRemoveImage(idx)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botões de ação */}
                <div className={styles.buttons}>
                    <Button
                        text={loading ? "Enviando..." : "Confirmar"}
                        type="primary"
                        disabled={loading}
                    />
                    <Button text="Cancelar" type="secondary" handleFunction={onClose} />
                </div>
            </div>
        </div>
    );
}
