// Busca endereço por CEP usando a API ViaCEP
export async function fetchAddressByCep(cep: string) {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return null;
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return {
        state: data.uf || "",
        city: data.localidade || "",
        bairro: data.bairro || "",
        street: data.logradouro || ""
    };
}