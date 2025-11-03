"use client";

import { useEffect, useState } from "react";
import { options } from "@/utils/options";

import Button from "../Button/Button";
import Input from "../Input/Input";

import styles from "./Filter.module.scss";
import { FilterProps, FiltersState } from "@/utils/interfaces";
import { fetchCities, fetchStates } from "@/services/service";


export default function Filter({ onApplyFilter, onClose }: FilterProps) {
    const [filters, setFilters] = useState<FiltersState>({
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        state: undefined,
        city: undefined,
    });

    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    // Carrega estados ao montar o componente
    useEffect(() => {
        fetchStates().then(setStates);
    }, []);

    // Carrega cidades quando o estado muda
    useEffect(() => {
        if (filters.state) {
            fetchCities(filters.state).then(setCities);
            setFilters((prev) => ({ ...prev, city: undefined })); // limpa cidade ao mudar estado
        } else {
            setCities([]);
            setFilters((prev) => ({ ...prev, city: undefined }));
        }
    }, [filters.state]);

    const handleSubmit = () => {
        onApplyFilter(filters);
        onClose?.();
    };

    const handleCancel = () => {
        const cleared = {
            category: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            state: undefined,
            city: undefined,
        };
        setFilters(cleared);
        onApplyFilter({
            category: "",
            minPrice: 0,
            maxPrice: 9999999,
            state: undefined,
            city: undefined,
        });
        onClose?.(); // fecha o filtro
    };

    return (
        <section className={styles.filter} aria-labelledby="filter-title">
            <h2 id="filter-title">Filtrar por:</h2>

            <Input
                type="select"
                label="Categorias"
                placeholder="Selecione uma categoria"
                options={options} // Defina suas opções de categoria
                value={filters.category}
                onChange={(e) =>
                    setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
            />

            <Input
                type="select"
                label="Estado"
                placeholder="Selecione um estado"
                options={states.map((state) => ({ value: state, label: state }))}
                value={filters.state}
                onChange={(e) =>
                    setFilters((prev) => ({
                        ...prev,
                        state: e.target.value,
                        city: "", // limpa cidade ao trocar o estado
                    }))
                }
            />

            <Input
                type="select"
                label="Cidade"
                placeholder="Selecione uma cidade"
                options={cities.map((city) => ({ value: city, label: city }))}
                value={filters.city}
                onChange={(e) =>
                    setFilters((prev) => ({ ...prev, city: e.target.value }))
                }
                disabled={!filters.state}
            />

            <fieldset className={styles.price}>
                <legend>Preço</legend>
                <div className={styles.priceRange}>
                    <Input
                        type="number"
                        placeholder="1.00"
                        value={filters.minPrice ?? ""}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                minPrice: Number(e.target.value) || undefined,
                            }))
                        }
                    />
                    <span>até</span>
                    <Input
                        type="number"
                        placeholder="1.000.000"
                        value={filters.maxPrice ?? ""}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                maxPrice: Number(e.target.value) || undefined,
                            }))
                        }
                    />
                </div>
            </fieldset>

            <div className={styles.buttons}>
                <Button text="Limpar" type="secondary" handleFunction={handleCancel} />
                <Button text="Filtrar" type="primary" handleFunction={handleSubmit} />
            </div>
        </section>
    );
}