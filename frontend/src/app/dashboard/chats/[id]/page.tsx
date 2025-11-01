"use client";

import { useEffect, useState } from "react";
import Message from "@/components/Message/Message";
import Input from "@/components/Input/Input";
import styles from "./page.module.scss";
import { Messages } from "@/utils/interfaces";
import { getMessages } from "@/services/conversation";
import { useParams } from "next/navigation";
import { socket } from "@/services/api";

export default function ChatConversationPage() {
  const [loggedUserId, setLoggedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const { id } = useParams();
  const conversationId = Number(id);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setLoggedUserId(user.id);
      } catch (error) {
        console.error("Erro ao ler usuário do localStorage:", error);
      }
    }

    if (!conversationId) return;

    // Função para conectar e entrar na conversa
    const connectSocket = () => {
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("joinConversation", conversationId); // entra na room
    };

    // Listeners
    const handleConnect = () => {
      console.log("Conectado ao servidor, id:", socket.id);
      socket.emit("joinConversation", conversationId);
    };

    const handleDisconnect = () => {
      console.log("Desconectado do servidor");
    };

    const handleNewMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("message", handleNewMessage);

    // Buscar mensagens iniciais
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessages(conversationId);
        console.log("Mensagens recebidas:", data);
        setMessages(data);
      } catch (error) {
        console.error("Erro ao carregar as mensagens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    connectSocket();

    // Cleanup ao desmontar
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message", handleNewMessage);
      socket.emit("leaveConversation", conversationId); // sai da room
    };
  }, [conversationId]);



  const sendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || !loggedUserId) return; // só envia se tiver usuário

    socket.emit("sendMessage", {
      conversationId,
      senderId: loggedUserId,
      content: inputValue,
    });

    setInputValue("");
  };

  return (
    <main className={styles.chatConversationPage} aria-label="Conversa">
      <section className={styles.messages} aria-label="Mensagens da conversa">
        {messages.map((message) => (
          <Message text={message.content} type={loggedUserId === message.senderId ? "sender" : "recipient"} key={message.id} />
        ))}
      </section>

      <form
        className={styles.inputText}
        onSubmit={sendMessage}
      >
        <Input
          type="textarea"
          placeholder="Digite sua mensagem..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
    </main>
  );
}