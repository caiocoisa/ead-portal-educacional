"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, Button, Tooltip } from "@heroui/react";
import { userProgressRepository } from "@/services/user-progress";

export function HomeResetButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleConfirm() {
    userProgressRepository.clearAll();
    router.push("/");
  }

  return (
    <>
      <Tooltip delay={300}>
        <Tooltip.Trigger>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            onPress={() => setIsOpen(true)}
          >
            Início
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>Volta à tela de boas-vindas e apaga o progresso</Tooltip.Content>
      </Tooltip>
      <AlertDialog.Root isOpen={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Voltar ao início?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                Isso vai apagar seu nome e todo o progresso salvo neste
                navegador, te levando de volta à tela de boas-vindas. Essa
                ação não pode ser desfeita.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button slot="close" variant="ghost">
                  Cancelar
                </Button>
                <Button variant="danger" onPress={handleConfirm}>
                  Voltar ao início
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog.Root>
    </>
  );
}
