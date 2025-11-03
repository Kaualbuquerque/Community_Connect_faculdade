"use client";

import { useState, useEffect } from "react";
import styles from "./ServiceModal.module.scss";

import Button from "../Button/Button";
import Input from "../Input/Input";
import { options } from "@/utils/options";
import { CreateServiceDTO, RegisterData, Service, ServiceModalProps } from "@/utils/interfaces";
import { uploadImages } from "@/services/serviceImages";

export default function ServiceModal({ isOpen, onClose, serviceData, onSubmit }: ServiceModalProps) {
    // Dados vazios padrão para o provedor
    const emptyProvider: RegisterData = {
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "consumer",
        cep: "",
        state: "",
        city: "",
        number: "",
    };

    // Estado do formulário
    const [form, setForm] = useState<Service>({
        id: 0,
        name: "",
        description: "",
        provider: emptyProvider,
        state: "",
        city: "",
        category: "",
        images: [],
        price: "",
        ...serviceData, // preenche com dados existentes se for edição
    });

    // Estado das imagens selecionadas no frontend
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    // Atualiza estado quando serviceData muda (ex.: ao abrir modal para edição)
    useEffect(() => {
        setForm({
            id: 0,
            name: "",
            description: "",
            provider: emptyProvider,
            state: "",
            city: "",
            category: "",
            images: [],
            price: "",
            ...serviceData,
        });
        setImages([]);
    }, [serviceData]);

    if (!isOpen) return null;

    // Atualiza campos do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Limita campo de preço
        if (name === "price" && value.length > 8) return;

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Manipula seleção de arquivos (limite 5)
    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);
        const totalFiles = images.length + selectedFiles.length;

        if (totalFiles > 5) {
            alert("Você pode enviar no máximo 5 imagens.");
            return;
        }

        setImages(prev => [...prev, ...selectedFiles]);
    };

    // Remove imagem selecionada do estado
    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleCreateService = async () => {
        if (!form.name.trim() || !form.description.trim() || !form.price || !form.category) return;

        try {
            setLoading(true);

            const payload: CreateServiceDTO = {
                name: form.name,
                description: form.description,
                price: form.price.toString(),
                category: form.category,
                state: form.state,
                city: form.city,
                images: [], // enviadas separadamente
            };

            let serviceId: number;

            if (serviceData?.id) {
                await onSubmit(payload, serviceData.id); // atualiza serviço
                serviceId = serviceData.id;
            } else {
                const createdService = await onSubmit(payload); // cria novo serviço
                serviceId = createdService.id;
            }

            // Envia imagens novas (se houver)
            if (images.length > 0) {
                await uploadImages(serviceId, images);
            }

            alert(serviceData?.id ? "Serviço atualizado com sucesso!" : "Serviço criado com sucesso!");
            onClose(true);

        } catch (err) {
            console.error(err);
            alert(serviceData?.id ? "Erro ao atualizar serviço." : "Erro ao criar serviço.");
        } finally {
            setLoading(false);
        }
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
                    value={form.name}
                    onChange={handleInputChange}
                />

                <Input
                    label="Descrição"
                    type="textarea"
                    name="description"
                    placeholder="Digite a descrição do serviço"
                    required
                    maxLength={300}
                    value={form.description}
                    onChange={handleInputChange}
                />

                <Input
                    label="Preço"
                    type="number"
                    name="price"
                    placeholder="Digite o valor do serviço"
                    required
                    maxLength={10}
                    value={form.price}
                    onChange={handleInputChange}
                />

                <Input
                    label="Categoria"
                    type="select"
                    name="category"
                    placeholder="Selecione uma categoria"
                    required
                    value={form.category}
                    onChange={handleInputChange}
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
                        onChange={handleFilesChange}
                        disabled={images.length >= 5} // desabilita se já tiver 5 imagens
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
                        handleFunction={handleCreateService}
                        disabled={loading}
                    />
                    <Button text="Cancelar" type="secondary" handleFunction={onClose} />
                </div>
            </div>
        </div>
    );
}
