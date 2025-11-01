"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import ServiceBanner from "@/components/ServiceBanner/ServiceBanner";
import Filter from "@/components/Filter/Filter";
import styles from "./page.module.scss";

import filter_light from "@/icons/favorite/filter_light.png";
import filter_dark from "@/icons/favorite/filter_dark.png";
import { getAllServices } from "@/services/service";
import { FiltersState, Service } from "@/utils/interfaces";
import { useTheme } from "@/context/ThemeContext";

export default function SearchServicePage() {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [loading, setLoading] = useState(true);

  const filterIcon = theme === "light" ? filter_dark : filter_light;

  const toggleFilter = () => setIsFilterVisible((prev) => !prev);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      // Passa filtros e busca para a API
      const data = await getAllServices({
        search,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        state: filters.state,
        city: filters.city,
      });

      setServices(data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  // refetch sempre que search ou filters mudar
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <main className={styles.searchServicePage} aria-label="Buscar serviços">
      <header>
        <h1>O que você precisa hoje?</h1>
      </header>

      <section className={styles.inputs}>
        <Input
          type="text"
          placeholder="Pesquisar por serviço"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          text=""
          type="secondary"
          icon={filterIcon}
          handleFunction={toggleFilter}
        />
      </section>

      {isFilterVisible &&
        <Filter
          onApplyFilter={setFilters}
          onClose={() => setIsFilterVisible(false)}
        />}

      <section className={styles.services} aria-label="Lista de serviços">
        {loading && <p>Carregando serviços...</p>}

        {!loading && services.length === 0 && (
          <p>Nenhum serviço encontrado com os filtros selecionados.</p>
        )}

        {!loading &&
          services.map((service) => (
            <ServiceBanner key={service.id} role="consumer" service={service} />
          ))}
      </section>
    </main>
  );
}
