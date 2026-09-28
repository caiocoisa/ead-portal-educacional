import { Card } from "@heroui/react";
import { FaqAccordion } from "./FaqAccordion";
import {
  courseFormat,
  courseObjectives,
  journeySteps,
  learningOutcomes,
  prerequisites,
  targetAudience,
  type LandingItem,
} from "@/content/landing";

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="w-full border-t border-(--border) px-6 py-12"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 id={`${id}-title`} className="text-2xl font-semibold">
            {title}
          </h2>
          {subtitle ? <p className="text-(--muted)">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="text-(--accent)">
            ✔
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CardGrid({ items, columns }: { items: LandingItem[]; columns: string }) {
  return (
    <ul className={`grid gap-4 ${columns}`}>
      {items.map((item) => (
        <li key={item.title} className="flex">
          <Card className="w-full">
            <Card.Content className="flex flex-col gap-2">
              <span aria-hidden="true" className="text-2xl">
                {item.icon}
              </span>
              <h3 className="font-semibold">{item.title}</h3>
              {item.description ? (
                <p className="text-sm text-(--muted)">{item.description}</p>
              ) : null}
            </Card.Content>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function CourseSections() {
  return (
    <>
      <Section
        id="objetivos"
        title="Objetivos do curso"
        subtitle="O que este módulo se propõe a desenvolver em você."
      >
        <CheckList items={courseObjectives} />
      </Section>

      <Section
        id="publico"
        title="A quem se destina"
        subtitle="Este curso foi pensado para quem planeja experiências de aprendizagem a distância."
      >
        <CardGrid items={targetAudience} columns="sm:grid-cols-3" />
      </Section>

      <Section id="pre-requisitos" title="Pré-requisitos">
        <CheckList items={prerequisites} />
      </Section>

      <Section
        id="resultados"
        title="O que você será capaz de fazer ao final"
        subtitle="Competências que você leva do módulo para a sua prática."
      >
        <CardGrid items={learningOutcomes} columns="sm:grid-cols-2" />
      </Section>

      <Section
        id="como-funciona"
        title="Como funciona"
        subtitle="Uma jornada linear em três etapas."
      >
        <CardGrid items={journeySteps} columns="sm:grid-cols-3" />
      </Section>

      <Section id="formato" title="Formato e recursos">
        <CardGrid items={courseFormat} columns="sm:grid-cols-2 lg:grid-cols-4" />
      </Section>

      <Section id="faq" title="Perguntas frequentes">
        <FaqAccordion />
      </Section>

      <section className="w-full border-t border-(--border) px-6 py-10 text-center">
        <p className="mb-3 text-lg font-semibold">Pronto para começar?</p>
        <a
          href="#inicio"
          className="inline-block rounded-full bg-(--accent) px-6 py-2 font-medium text-(--accent-foreground)"
        >
          Iniciar minha jornada
        </a>
      </section>
    </>
  );
}
