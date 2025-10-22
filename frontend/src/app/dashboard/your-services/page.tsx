"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./page.module.scss";
import ServiceModal from "@/components/ServiceModal/ServiceModal";
import Button from "@/components/Button/Button";
import { Service } from "@/utils/interfaces";

export default function YourServicesPage() {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleAddNewService = () => {
        setShowModal(true);
    };

    const handleCloseModal = (shouldReload?: boolean) => {
        setShowModal(false);
    };

    return (
        <main className={styles.yourServicesPage} aria-label="Seus serviços">
            <header>
                <h1>Verifique seus serviços</h1>
            </header>

            <section className={styles.services} aria-label="Lista de serviços">
                {loading && <p>Carregando serviços...</p>}

                <p>Você ainda não possui serviços cadastrados.</p>
            </section>

            <div className={styles.addService}>
                <Button
                    text="+ Adicionar novo serviço"
                    type="secondary"
                    handleFunction={handleAddNewService}
                />
            </div>

            {showModal && (
                <ServiceModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    onSubmit={() => { }}
                />
            )}
        </main>
    );
}
