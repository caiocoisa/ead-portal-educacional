"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, Button } from "@heroui/react";
import { progressRepository } from "@/services/user-progress";

/** Refaz só a avaliação: o restante do progresso (e-book, mapa, relatório) é mantido. */
export function RestartAssessmentModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleConfirm() {
    progressRepository.resetAssessment();
    router.push("/avaliacao");
  }

  return (
    <>
      <Button variant="danger-soft" onPress={() => setIsOpen(true)}>
        Refazer a avaliação
      </Button>
      <AlertDialog.Root isOpen={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Refazer a avaliação?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                Isso vai apagar as suas respostas e o resultado da avaliação e te levar de
                volta à primeira pergunta. O restante do seu progresso é mantido. Essa ação não
                pode ser desfeita.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button slot="close" variant="ghost">
                  Cancelar
                </Button>
                <Button variant="danger" onPress={handleConfirm}>
                  Refazer
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog.Root>
    </>
  );
}
