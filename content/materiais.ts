import type { MapNodeId } from "@/content/mapa";

/**
 * Medidas dos materiais usadas para calcular o que o aluno já viu (ver
 * docs/plano-implementacao-fluxo-v3.md, seção 4.1). Ficam aqui, e não nos
 * componentes, para o serviço de progresso e os testes compartilharem a mesma fonte.
 */

/** Total de páginas do e-book (leitor em public/ebook/leitor.html). */
export const EBOOK_TOTAL_PAGES = 18;

/** Elementos do mapa interativo, na ordem do diagrama (content/mapa.ts). */
export const MAPA_ELEMENT_IDS: readonly MapNodeId[] = [
  "publico",
  "objetivos",
  "atividades",
  "avaliacao",
];
