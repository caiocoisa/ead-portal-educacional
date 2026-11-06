/**
 * Armazenamento compartilhado de uma preferência (tamanho da fonte, contraste, tema).
 *
 * Existe para que todos os controles da mesma preferência (a régua lateral, o painel largo e a
 * linha do celular ficam montados ao mesmo tempo, só um visível por vez) mostrem o mesmo estado,
 * e para a interface ler o valor sem erro de hidratação: no servidor e na primeira renderização
 * do navegador vale o **padrão**; o valor salvo só entra depois.
 */

export interface PreferenceStore<T extends string> {
  subscribe(listener: () => void): () => void;
  /** Valor salvo, ou o padrão se não houver nada válido. É um texto, logo estável entre leituras. */
  getSnapshot(): T;
  /** Sempre o padrão: é o que o servidor e a hidratação veem. */
  getServerSnapshot(): T;
  set(value: T): void;
  /** Reflete o valor salvo no atributo do `<html>`, se a preferência tiver um. */
  applyStored(): void;
  /** Avisa os assinantes de uma mudança feita por fora (por exemplo, pelo HeroUI no tema). */
  notify(): void;
}

interface PreferenceStoreOptions<T extends string> {
  storageKey: string;
  defaultValue: T;
  allowed: readonly T[];
  /** Atributo `data-*` do `<html>` que reflete o valor; omitido quando outro código o aplica. */
  attribute?: string;
}

export function createPreferenceStore<T extends string>({
  storageKey,
  defaultValue,
  allowed,
  attribute,
}: PreferenceStoreOptions<T>): PreferenceStore<T> {
  const listeners = new Set<() => void>();

  function read(): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(storageKey);
      return allowed.includes(stored as T) ? (stored as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  function applyStored() {
    if (attribute && typeof document !== "undefined") {
      document.documentElement.setAttribute(attribute, read());
    }
  }

  function notify() {
    listeners.forEach((listener) => listener());
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      // O evento `storage` chega só das outras janelas: outra aba, ou o leitor do e-book.
      const onStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === storageKey) {
          applyStored();
          listener();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot: read,
    getServerSnapshot: () => defaultValue,
    set(value) {
      try {
        window.localStorage.setItem(storageKey, value);
      } catch {
        // sem armazenamento disponível: a escolha vale só até recarregar
      }
      if (attribute) document.documentElement.setAttribute(attribute, value);
      notify();
    },
    applyStored,
    notify,
  };
}
