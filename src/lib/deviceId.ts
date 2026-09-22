const STORAGE_KEY = 'meu-legado:device-id';

/**
 * Identificador anônimo persistido no dispositivo, usado como `user_id`
 * enquanto o app não tem autenticação real. Quando a autenticação for
 * adicionada, isso deve ser substituído pelo id da sessão do Supabase Auth.
 */
export function getDeviceId(): string {
  try {
    const existente = localStorage.getItem(STORAGE_KEY);
    if (existente) return existente;
    const novo = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, novo);
    return novo;
  } catch {
    return 'anonimo';
  }
}
