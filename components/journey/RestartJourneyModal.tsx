"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, Button } from "@heroui/react";
import { userProgressRepository } from "@/services/user-progress";

export function RestartJourneyModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleConfirm() {
    userProgressRepository.resetJourney();
    router.push("/video");
  }

  return (
    <>
      <Button variant="danger-soft" onPress={() => setIsOpen(true)}>
        Reiniciar jornada
      </Button>
      <AlertDialog.Root isOpen={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Reiniciar jornada?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                Isso vai apagar o resultado da sua avaliação e te levar de
                volta ao início do vídeo. Essa ação não pode ser desfeita.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button slot="close" variant="ghost">
                  Cancelar
                </Button>
                <Button variant="danger" onPress={handleConfirm}>
                  Reiniciar
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog.Root>
    </>
  );
}
