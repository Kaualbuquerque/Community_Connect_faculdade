import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAutoLogout() {
  const router = useRouter();

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    };

    // Quando o usuário fecha ou recarrega a aba
    const handleBeforeUnload = () => logout();

    // Quando o usuário tenta sair do dashboard (clicando em links, botões etc.)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        logout();
      }
    };

    // Quando o usuário usa o botão de voltar/avançar
    const handlePopState = () => {
      logout();
      router.replace("/auth/login");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);
}
