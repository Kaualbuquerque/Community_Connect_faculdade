"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import styles from "./page.module.scss";
import { deleteNote, getNotes } from "@/services/note";
import { HistoryService, Notes } from "@/utils/interfaces";
import Note from "@/components/Note/Note";
import { getHistory } from "@/services/service";
import ServiceBanner from "@/components/ServiceBanner/ServiceBanner";
import { useAutoLogout } from "@/utils/useAutoLogout";
import NoteModal from "@/components/NoteModal/NoteModal";

export default function DashboardPage() {
    const [showModal, setShowModal] = useState(false);
    const [notes, setNotes] = useState<Notes[]>([]);
    const [services, setServices] = useState<HistoryService[]>([]);
    const [loggedUserId, setLoggedUserId] = useState<number>();
    const [loading, setLoading] = useState(true);

    const fetchNotes = useCallback(async () => {
        if (!loggedUserId) return;

        try {
            setLoading(true);
            const notes = await getNotes();
            const services = await getHistory(loggedUserId);

            const formatted = notes.map((note: any) => ({
                ...note,
                date: note.createdAt,
            }));

            setNotes(formatted);
            setServices(services);

        } catch (error) {
            console.error("Erro ao carregar:", error);
        } finally {
            setLoading(false);
        }
    }, [loggedUserId]);

    const handleDeleteNote = async (id: string) => {
        try {
            await deleteNote(id);
            setNotes((prev) => prev.filter((s) => s.id !== id));
            alert("Nota deletada com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar nota:", error);
            alert("Não foi possível deletar o nota.");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            if (user?.id) {
                setLoggedUserId(user.id);
            } else {
                throw new Error("Usuário inválido");
            }
        } catch (error) {
            console.error("Erro ao carregar usuário:", error);
        }
    }, []);

    useEffect(() => {
        if (loggedUserId) {
            fetchNotes();
        }
    }, [loggedUserId, fetchNotes]);

    return (
        <main className={styles.dashboardPage} aria-label="Painel do usuário">

            <header>
                <h1>Bem-vindo</h1>
            </header>

            {/* Histórico de serviços */}
            <section className={styles.history} aria-labelledby="history-title">
                <h2 id="history-title">Histórico de serviço</h2>
                <div className={styles.serviceHistory}>
                    {services.map((historyRecord) =>
                        <ServiceBanner
                            role="consumer"
                            service={historyRecord.service}
                            key={historyRecord.id}
                        />
                    )}
                </div>
            </section>

            {/* Notas pessoais */}
            <section className={styles.personalNotes} aria-labelledby="notes-title">
                <h2 id="notes-title">Notas pessoais</h2>



                <div className={styles.notes}>
                    {loading && <p>Carregando notas...</p>}

                    {!loading && notes.length === 0 && (
                        <p>Você ainda não criou nenhuma nota</p>
                    )}

                    {!loading &&
                        notes.map((note) => (
                            <Note content={note.content} date={note.date} onDelete={() => handleDeleteNote(note.id)} key={note.id} />
                        ))}
                </div>

                <div className={styles.addNote}>
                    <Button
                        text="+ Adicionar nota"
                        type="secondary"
                        handleFunction={() => setShowModal(true)}
                    />
                </div>

            </section>

            {showModal && (
                <NoteModal
                    onClose={handleCloseModal}
                />
            )}
        </main>
    );
}
