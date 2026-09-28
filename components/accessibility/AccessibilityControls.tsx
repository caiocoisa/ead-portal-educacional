"use client";

import { Drawer } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { FontSizeControl } from "./FontSizeControl";
import { HighContrastToggle } from "./HighContrastToggle";
import { ThemeToggle } from "./ThemeToggle";

export function AccessibilityControls() {
  return (
    <Drawer.Root>
      <Drawer.Trigger className={buttonVariants({ variant: "ghost", size: "sm" })}>
        Acessibilidade
      </Drawer.Trigger>
      <Drawer.Backdrop>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.Heading>Acessibilidade</Drawer.Heading>
              <Drawer.CloseTrigger />
            </Drawer.Header>
            <Drawer.Body className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Tema</span>
                <ThemeToggle />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Tamanho da fonte</span>
                <FontSizeControl />
              </div>
              <HighContrastToggle />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer.Root>
  );
}
