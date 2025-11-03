"use client";

import { useEffect, useState, useCallback } from "react";
import ServiceBanner from "@/components/ServiceBanner/ServiceBanner";
import styles from "./page.module.scss";
import Button from "@/components/Button/Button";
import { createService, deleteService, getMyServices, updateService } from "@/services/service";
import { Service } from "@/utils/interfaces";
import ServiceModal from "@/components/ServiceModal/ServiceModal";

export default function YourServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMyServices();
            setServices(data);
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleEditService = (id: number) => {
        const serviceToEdit = services.find((s) => s.id === id);
        if (!serviceToEdit) return;

        setSelectedService(serviceToEdit);
        setShowModal(true);
    };

    const handleDeleteService = async (id: number) => {
        try {
            await deleteService(id);
            setServices((prev) => prev.filter((s) => s.id !== id));
            alert("Serviço deletado com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar serviço:", error);
            alert("Não foi possível deletar o serviço.");
        }
    };

    const handleAddNewService = () => {
        setSelectedService(null);
        setShowModal(true);
    };

    const handleCloseModal = (shouldReload?: boolean) => {
        setShowModal(false);
        setSelectedService(null);
        if (shouldReload) fetchServices();
    };

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

  console.log(services)
    return (
        <main className={styles.yourServicesPage} aria-label="Seus serviços">
            <header>
                <h1>Verifique seus serviços</h1>
            </header>

            <section className={styles.services} aria-label="Lista de serviços">
                {loading && <p>Carregando serviços...</p>}

                {!loading && services.length === 0 && (
                    <p>Você ainda não possui serviços cadastrados.</p>
                )}

                {!loading &&
                    services.map((service) => (
                        <ServiceBanner
                            key={service.id}
                            role="provider"
                            service={service}
                            onEdit={() => handleEditService(service.id)}
                            onDelete={() => handleDeleteService(service.id)}
                        />
                    ))}
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
                    serviceData={
                        selectedService
                            ? {
                                id: selectedService.id,
                                name: selectedService.name,
                                provider: selectedService.provider,
                                description: selectedService.description,
                                city: selectedService.city,
                                state: selectedService.state,
                                category: selectedService.category,
                                images: selectedService.images,
                                price: selectedService.price.toString(),
                            }
                            : {
                                id: 0,
                                provider: {
                                    id: "",
                                    name: "",
                                    email: "",
                                    password: "",
                                    phone: "",
                                    role: "provider",
                                    cep: "",
                                    state: "",
                                    city: "",
                                    number: "",
                                },
                                name: "",
                                description: "",
                                city: "",
                                state: "",
                                category: "",
                                images: [],
                                price: "",
                            }
                    }
                    onSubmit={
                        selectedService
                            ? (data) => updateService(selectedService.id, data)
                            : createService
                    }
                />
            )}
        </main>
    );
}
