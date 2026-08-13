"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { changeMemberRole, setMemberActive, revokeInvitation } from "./actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MemberRowActions({
  memberId,
  role,
  isActive,
}: {
  memberId: string;
  role: "admin" | "assistant";
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<void>, successMessage: string) {
    startTransition(async () => {
      try {
        await action();
        toast.success(successMessage);
      } catch {
        toast.error("A operação não foi permitida.");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={pending}>
          Ações
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() =>
            run(
              () =>
                changeMemberRole(
                  memberId,
                  role === "admin" ? "assistant" : "admin",
                ),
              "Papel atualizado.",
            )
          }
        >
          {role === "admin" ? "Tornar assistente" : "Tornar administrador(a)"}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant={isActive ? "destructive" : "default"}
          onSelect={() =>
            run(
              () => setMemberActive(memberId, !isActive),
              isActive ? "Membro desativado." : "Membro reativado.",
            )
          }
        >
          {isActive ? "Desativar acesso" : "Reativar acesso"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RevokeInvitationButton({
  invitationId,
}: {
  invitationId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await revokeInvitation(invitationId);
          toast.success("Convite revogado.");
        })
      }
    >
      Revogar
    </Button>
  );
}
