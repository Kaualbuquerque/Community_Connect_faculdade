"use client";

import Image from "next/image";
import styles from "./RegisterForm.module.scss";
import Input from "../Input/Input";
import { useState } from "react";
import Button from "../Button/Button";
import Link from "next/link";
import logo from "../../../public/icons/logo/community_connect_logo_dark.png";
import { useRouter } from "next/navigation";
import { maskCep, maskPhone } from "@/utils/masks";
import { fetchAddressByCep } from "@/utils/cep";
import { authService } from "@/services/auth";

export default function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "consumer",
        cep: "",
        state: "",
        city: "",
        number: "",
    });

    const router = useRouter();

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;

        if (name === "cep") {
            const masked = maskCep(value);
            setForm({ ...form, cep: masked });

            // busca automática quando o CEP estiver completo
            if (masked.replace(/\D/g, "").length === 8) {
                fetchAddressByCep(masked).then((address) => {
                    if (address) {
                        setForm((prev) => ({
                            ...prev,
                            state: address.state,
                            city: address.city,
                        }));
                    }
                });
            }
            return;
        }

        if (name === "phone") {
            setForm({ ...form, phone: maskPhone(value) });
            return;
        }

        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        const data = {
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone.replace(/\D/g, ""), // apenas números
            role: form.role as "consumer" | "provider",
            cep: form.cep.replace(/\D/g, ""),
            state: form.state,
            city: form.city,
            number: form.number,
        };

        try {
            await authService.register(data);
            router.push("/auth/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao registrar usuário.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={styles.registerForm} onSubmit={handleSubmit}>
            <div className={styles.logo}>
                <Image src={logo} alt="Logo modo claro" />
                <h3>Community Connect</h3>
            </div>
            <h2>Registrar</h2>

            <div className={styles.profile}>
                <p>Escolha seu perfil:</p>
                <div>
                    <Input
                        id="consumer"
                        label="Consumidor"
                        type="radio"
                        name="role"
                        value="consumer"
                        checked={form.role === "consumer"}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="provider"
                        label="Provedor"
                        type="radio"
                        name="role"
                        value="provider"
                        checked={form.role === "provider"}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <Input label="Nome completo:" type="text" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email:" type="email" name="email" value={form.email} onChange={handleChange} required />
            <Input label="Senha:" type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} maxLength={12} />
            <Input label="Confirmar senha:" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required minLength={6} maxLength={12} />
            <Input label="Telefone:" type="text" name="phone" value={form.phone} onChange={handleChange} required minLength={14} maxLength={15} />

            <div className={styles.location}>
                <Input label="CEP:" type="text" name="cep" value={form.cep} onChange={handleChange} required minLength={9} maxLength={9} />
                <Input label="Estado:" type="text" name="state" value={form.state} onChange={handleChange} required maxLength={2} />
                <Input label="Cidade:" type="text" name="city" value={form.city} onChange={handleChange} required />
                <Input label="Número:" type="text" name="number" value={form.number} onChange={handleChange} required />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className={styles.buttons}>
                <Button text={loading ? "Cadastrando..." : "Registrar"} type="primary" />
                <Link href="/auth/login">
                    <p>Já tem uma conta?</p>
                </Link>
            </div>
        </form>
    );
}
