"use client"

import Image from "next/image";
import styles from "./RegisterForm.module.scss";
import Input from "../Input/Input";
import { useState } from "react";
import Button from "../Button/Button";
import Link from "next/link";
import logo from "../../../public/icons/logo/community_connect_logo_dark.png";
import { useRouter } from "next/navigation";


export default function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <form className={styles.registerForm}>
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
                        name="userProfile"
                        value="consumer"
                    />
                    <Input
                        id="provider"
                        label="Provedor"
                        type="radio"
                        name="userProfile"
                        value="provider"
                    />
                </div>
            </div>
            <Input
                label="Nome completo:"
                type="text"
                name="name"
                placeholder="Seu nome"
                required
            />
            <Input
                label="Email:"
                type="email"
                name="email"
                placeholder="Seu@email.com"
                required
            />
            <Input
                label="Senha:"
                type="password"
                name="password"
                placeholder="Sua senha"
                required
                minLength={6}
                maxLength={12}
            />
            <Input
                label="Confirmar senha:"
                type="password"
                name="confirmPassword"
                placeholder="Confirmar senha"
                required
                minLength={6}
                maxLength={12}
            />
            <Input
                label="Telefone:"
                type="text"
                name="phone"
                placeholder="(xx) xxxxx-xxxx"
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
                    required
                    minLength={9}
                    maxLength={9}
                />
                <Input
                    label="Estado:"
                    type="text"
                    name="state"
                    placeholder="PE"
                    required
                    maxLength={2}
                />
                <Input
                    label="Cidade:"
                    type="text"
                    name="city"
                    placeholder="Recife"
                    required
                />
                <Input
                    label="Número:"
                    type="text"
                    name="number"
                    placeholder="xx"
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
