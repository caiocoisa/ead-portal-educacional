"use client";

import { Accordion } from "@heroui/react";
import { faqs } from "@/content/landing";

export function FaqAccordion() {
  return (
    <Accordion>
      {faqs.map((faq) => (
        <Accordion.Item key={faq.question} id={faq.question}>
          <Accordion.Heading>
            <Accordion.Trigger>
              {faq.question}
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>{faq.answer}</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
