import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { createPreferenceStore } from "@/lib/preferences/preferenceStore";
import { contrastStore, FONT_SIZES, fontSizeStore, themeStore } from "@/lib/preferences/stores";

type Tamanho = "pequeno" | "medio" | "grande";

function novaLoja() {
  return createPreferenceStore<Tamanho>({
    storageKey: "teste:tamanho",
    defaultValue: "medio",
    allowed: ["pequeno", "medio", "grande"],
    attribute: "data-tamanho",
  });
}

describe("createPreferenceStore", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-tamanho");
  });

  it("sem nada salvo, vale o padrão", () => {
    expect(novaLoja().getSnapshot()).toBe("medio");
  });

  it("lê o valor salvo", () => {
    localStorage.setItem("teste:tamanho", "grande");
    expect(novaLoja().getSnapshot()).toBe("grande");
  });

  it("um valor salvo que não é permitido vale como o padrão", () => {
    localStorage.setItem("teste:tamanho", "gigante");
    expect(novaLoja().getSnapshot()).toBe("medio");
  });

  it("o valor do servidor é sempre o padrão, mesmo com algo salvo", () => {
    localStorage.setItem("teste:tamanho", "grande");
    expect(novaLoja().getServerSnapshot()).toBe("medio");
  });

  it("a leitura é estável: é um texto, então o React não reexecuta sem mudança", () => {
    const loja = novaLoja();
    localStorage.setItem("teste:tamanho", "pequeno");
    expect(Object.is(loja.getSnapshot(), loja.getSnapshot())).toBe(true);
  });

  describe("set", () => {
    it("grava, reflete no atributo do html e avisa os assinantes", () => {
      const loja = novaLoja();
      const ouvinte = vi.fn();
      loja.subscribe(ouvinte);
      loja.set("grande");
      expect(localStorage.getItem("teste:tamanho")).toBe("grande");
      expect(document.documentElement.getAttribute("data-tamanho")).toBe("grande");
      expect(loja.getSnapshot()).toBe("grande");
      expect(ouvinte).toHaveBeenCalledTimes(1);
    });

    it("todos os assinantes recebem o aviso, e só quem não cancelou", () => {
      const loja = novaLoja();
      const a = vi.fn();
      const b = vi.fn();
      loja.subscribe(a);
      const cancelaB = loja.subscribe(b);
      cancelaB();
      loja.set("pequeno");
      expect(a).toHaveBeenCalledTimes(1);
      expect(b).not.toHaveBeenCalled();
    });

    it("sem armazenamento disponível não lança erro e ainda aplica o atributo", () => {
      const loja = novaLoja();
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("cheio", "QuotaExceededError");
      });
      expect(() => loja.set("grande")).not.toThrow();
      expect(document.documentElement.getAttribute("data-tamanho")).toBe("grande");
      vi.restoreAllMocks();
    });
  });

  describe("applyStored", () => {
    it("reflete o valor salvo no atributo", () => {
      localStorage.setItem("teste:tamanho", "pequeno");
      novaLoja().applyStored();
      expect(document.documentElement.getAttribute("data-tamanho")).toBe("pequeno");
    });

    it("sem nada salvo, aplica o padrão", () => {
      novaLoja().applyStored();
      expect(document.documentElement.getAttribute("data-tamanho")).toBe("medio");
    });

    it("sem atributo configurado, não mexe no html", () => {
      const sem = createPreferenceStore<Tamanho>({
        storageKey: "teste:tamanho",
        defaultValue: "medio",
        allowed: ["pequeno", "medio", "grande"],
      });
      localStorage.setItem("teste:tamanho", "grande");
      sem.applyStored();
      sem.set("pequeno");
      expect(document.documentElement.getAttribute("data-tamanho")).toBeNull();
    });
  });

  describe("subscribe e o evento storage das outras janelas", () => {
    let ouvinte: Mock<() => void>;
    let cancela: () => void;
    let loja: ReturnType<typeof novaLoja>;

    beforeEach(() => {
      loja = novaLoja();
      ouvinte = vi.fn<() => void>();
      cancela = loja.subscribe(ouvinte);
    });

    afterEach(() => cancela());

    it("avisa e reaplica o atributo quando outra janela grava a mesma chave", () => {
      localStorage.setItem("teste:tamanho", "grande");
      window.dispatchEvent(new StorageEvent("storage", { key: "teste:tamanho" }));
      expect(ouvinte).toHaveBeenCalledTimes(1);
      expect(document.documentElement.getAttribute("data-tamanho")).toBe("grande");
    });

    it("avisa quando o armazenamento inteiro é limpo", () => {
      window.dispatchEvent(new StorageEvent("storage", { key: null }));
      expect(ouvinte).toHaveBeenCalledTimes(1);
    });

    it("ignora chaves de outras preferências", () => {
      window.dispatchEvent(new StorageEvent("storage", { key: "ead-portal:contrast" }));
      expect(ouvinte).not.toHaveBeenCalled();
    });

    it("depois de cancelar, não avisa mais", () => {
      cancela();
      window.dispatchEvent(new StorageEvent("storage", { key: "teste:tamanho" }));
      loja.set("pequeno");
      expect(ouvinte).not.toHaveBeenCalled();
    });
  });

  it("notify avisa quem assina, para mudanças feitas por fora", () => {
    const loja = novaLoja();
    const ouvinte = vi.fn();
    loja.subscribe(ouvinte);
    loja.notify();
    expect(ouvinte).toHaveBeenCalledTimes(1);
  });
});

describe("as preferências reais do portal", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-font-size");
    document.documentElement.removeAttribute("data-contrast");
  });

  it("os tamanhos de fonte vão do menor para o maior", () => {
    expect([...FONT_SIZES]).toEqual(["normal", "large", "extra-large"]);
  });

  it("fonte e contraste usam as mesmas chaves e atributos de antes", () => {
    fontSizeStore.set("extra-large");
    contrastStore.set("high");
    expect(localStorage.getItem("ead-portal:font-size")).toBe("extra-large");
    expect(localStorage.getItem("ead-portal:contrast")).toBe("high");
    expect(document.documentElement.getAttribute("data-font-size")).toBe("extra-large");
    expect(document.documentElement.getAttribute("data-contrast")).toBe("high");
  });

  it("o padrão do servidor é fonte normal, contraste normal e tema do sistema", () => {
    expect(fontSizeStore.getServerSnapshot()).toBe("normal");
    expect(contrastStore.getServerSnapshot()).toBe("normal");
    expect(themeStore.getServerSnapshot()).toBe("system");
  });

  it("o tema lê a chave do HeroUI e não mexe no html (quem aplica é o HeroUI)", () => {
    localStorage.setItem("heroui-theme", "dark");
    expect(themeStore.getSnapshot()).toBe("dark");
    themeStore.applyStored();
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();
  });

  it("um tema salvo que não existe vale como system", () => {
    localStorage.setItem("heroui-theme", "sepia");
    expect(themeStore.getSnapshot()).toBe("system");
  });
});
