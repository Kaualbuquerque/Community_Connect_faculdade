"use client";

import { useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";

import Image from "next/image";
import Link from "next/link";


import dashboard_icon from "../../../public/icons/sidebar/home-dark.png";
import search_icon from "../../../public/icons/sidebar/find-dark.png";
import favorites_icon from "../../../public/icons/sidebar/heart-dark.png";
import services_icon from "../../../public/icons/sidebar/service-dark.png";
import chats_icon from "../../../public/icons/sidebar/chats-dark.png";
import Button from "../Button/Button";

export default function Sidebar() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setRole(parsedUser.role);
            }
        }
    }, []);


    const menuItems = [
        { href: "/dashboard", label: "Painel", icon: dashboard_icon },
        { href: "/dashboard/search-service", label: "Buscar serviços", icon: search_icon },
        { href: "/dashboard/favorites", label: "Favoritos", icon: favorites_icon },
        ...(role === "provider"
            ? [{ href: "/dashboard/your-services", label: "Seus serviços", icon: services_icon }]
            : []),
        { href: "/dashboard/chats", label: "Chats", icon: chats_icon },
    ];

    return (
        <aside className={styles.sidebar} aria-label="Menu lateral">
            <nav className={styles.menu}>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href}>
                                <Image src={item.icon.src} alt={item.label} width={24} height={24} />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={styles.logout}>
                <Button text="Sair" type="alert" />
            </div>
        </aside>
    );
}
