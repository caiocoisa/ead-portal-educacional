import type { MapNodeId } from "@/content/mapa";

/**
 * Medidas dos materiais usadas para calcular o que o aluno já viu (ver
 * docs/plano-implementacao-fluxo-v3.md, seção 4.1). Ficam aqui, e não nos
 * componentes, para o serviço de progresso e os testes compartilharem a mesma fonte.
 */

/** Total de páginas do e-book (leitor em public/ebook/leitor.html). */
export const EBOOK_TOTAL_PAGES = 18;

/** Versão interativa do e-book no FlipHTML5, aberta em nova aba (não é embedada: não registra progresso). */
export const EBOOK_FLIPHTML5_URL = "https://online.fliphtml5.com/ykoqbl/ebook-planejar-com-ia/index.html";

/** Elementos do mapa interativo, na ordem do diagrama (content/mapa.ts). */
export const MAPA_ELEMENT_IDS: readonly MapNodeId[] = [
  "publico",
  "objetivos",
  "atividades",
  "avaliacao",
];
