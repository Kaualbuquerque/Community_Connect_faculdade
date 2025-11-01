"use client"

import Image from "next/image";
import styles from "./RegisterForm.module.scss";
import Input from "../Input/Input";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { maskCep, maskPhone } from "@/utils/masks";
import { fetchAddressByCep } from "@/utils/cep";
import Button from "../Button/Button";
import Link from "next/link";
import logo from "@/icons/logo/community_connect_logo_light.png";
import logo_dark from "@/icons/logo/community_connect_logo_dark.png";
import { registerUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { RegisterFormState } from "@/utils/interfaces";


export default function RegisterForm() {
    const { theme } = useTheme();
    const router = useRouter();

    const [form, setForm] = useState<RegisterFormState>({
        userProfile: "consumer",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        cep: "",
        state: "",
        city: "",
        number: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Máscaras e preenchimento automático de endereço pelo CEP
    const handleCepChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = async (e) => {
        const value = e.target.value;
        const masked = maskCep(value);
        setForm((prev) => ({ ...prev, cep: masked }));

        if (masked.replace("-", "").length === 8) {
            const address = await fetchAddressByCep(masked);
            if (address) {
                setForm((prev) => ({
                    ...prev,
                    state: address.state,
                    city: address.city,
                }));
            }
        }
    };

    const handlePhoneChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (e) => {
        const value = e.target.value;
        const masked = maskPhone(value);
        setForm((prev) => ({
            ...prev,
            phone: masked,
        }));
    };

    const handleInputChange: React.ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    > = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        if (!form.userProfile) {
            setError("Selecione o perfil do usuário.");
            return;
        }

        const payload = {
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone,
            role: form.userProfile as "consumer" | "provider",
            cep: form.cep,
            state: form.state,
            city: form.city,
            number: form.number,
        };
        setLoading(true);
        try {
            await registerUser(payload);

            setForm({
                userProfile: "consumer",
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                phone: "",
                cep: "",
                state: "",
                city: "",
                number: "",
            });

            router.push('/auth/login');

        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao registrar usuário.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className={styles.registerForm}>
            <div className={styles.logo}>
                {theme === "light" ? (
                    <Image src={logo_dark} alt="Logo modo claro" />
                ) : (
                    <Image src={logo} alt="communit connect logo" />
                )}
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
                        name="userProfile"
                        value="consumer"
                        checked={form.userProfile === "consumer"}
                        onChange={handleInputChange}
                    />
                    <Input
                        id="provider"
                        label="Provedor"
                        type="radio"
                        name="userProfile"
                        value="provider"
                        checked={form.userProfile === "provider"}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <Input
                label="Nome completo:"
                type="text"
                name="name"
                placeholder="Seu nome"
                value={form.name}
                onChange={handleInputChange}
                required
            />
            <Input
                label="Email:"
                type="email"
                name="email"
                placeholder="Seu@email.com"
                value={form.email}
                onChange={handleInputChange}
                required
            />
            <Input
                label="Senha:"
                type="password"
                name="password"
                placeholder="Sua senha"
                value={form.password}
                onChange={handleInputChange}
                required
                minLength={6}
                maxLength={12}
            />
            <Input
                label="Confirmar senha:"
                type="password"
                name="confirmPassword"
                placeholder="Confirmar senha"
                value={form.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={6}
                maxLength={12}
            />
            <Input
                label="Telefone:"
                type="text"
                name="phone"
                placeholder="(xx) xxxxx-xxxx"
                value={form.phone}
                onChange={handlePhoneChange}
                required
                minLength={15}
                maxLength={15}
            />
            <div className={styles.location}>
                <Input
                    label="CEP:"
                    type="text"
                    name="cep"
                    placeholder="xxxxx-xxx"
                    value={form.cep}
                    onChange={handleCepChange}
                    required
                    minLength={9}
                    maxLength={9}
                />
                <Input
                    label="Estado:"
                    type="text"
                    name="state"
                    placeholder="PE"
                    value={form.state}
                    onChange={handleInputChange}
                    required
                    maxLength={2}
                />
                <Input
                    label="Cidade:"
                    type="text"
                    name="city"
                    placeholder="Recife"
                    value={form.city}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    label="Número:"
                    type="text"
                    name="number"
                    placeholder="xx"
                    value={form.number}
                    onChange={handleInputChange}
                    required
                />
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
