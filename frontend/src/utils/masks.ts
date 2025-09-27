// Máscara para CEP (xxxxx-xxx)
export function maskCep(value: string) {
    let cep = value.replace(/\D/g, "");
    cep = cep.slice(0, 8);
    if (cep.length > 5) {
        cep = cep.slice(0, 5) + "-" + cep.slice(5);
    }
    return cep;
}

// Máscara para telefone (formato brasileiro)
export function maskPhone(value: string) {
    let phone = value.replace(/\D/g, "");
    phone = phone.slice(0, 11);
    if (phone.length === 0) return "";
    if (phone.length < 3) return `(${phone}`;
    if (phone.length < 7) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
    if (phone.length <= 11) return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    return phone;
}