"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, Button, Tooltip } from "@heroui/react";
import { progressRepository } from "@/services/user-progress";

/** Apaga todo o progresso salvo neste navegador, depois de confirmar. As preferências ficam. */
export function HomeResetButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleConfirm() {
    progressRepository.clearAll();
    router.push("/");
  }

  return (
    <>
      {/* O `Button` já é focável: vai direto dentro do `Tooltip`. Envolvê-lo em
          `Tooltip.Trigger` (um `div role="button"`) aninha dois botões, o que o
          axe-core acusa como `nested-interactive`. */}
      <Tooltip delay={300}>
        <Button variant="outline" size="sm" onPress={() => setIsOpen(true)}>
          Apagar meu progresso
        </Button>
        <Tooltip.Content>Apaga todo o progresso salvo neste navegador</Tooltip.Content>
      </Tooltip>
      <AlertDialog.Root isOpen={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Apagar o seu progresso?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                Isso vai apagar todo o progresso salvo neste navegador: páginas do e-book,
                elementos do mapa, respostas e resultado da avaliação. Suas preferências de
                acessibilidade são mantidas. Essa ação não pode ser desfeita.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button slot="close" variant="ghost">
                  Cancelar
                </Button>
                <Button variant="danger" onPress={handleConfirm}>
                  Apagar progresso
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog.Root>
    </>
  );
}
