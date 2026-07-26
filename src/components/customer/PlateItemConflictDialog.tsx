import type { CustomerPlateItem } from '@/contexts/CustomerPlateContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@workspace/ui';

type Conflict = {
  existingItem: CustomerPlateItem;
  incomingItem: CustomerPlateItem;
} | null;

type PlateItemConflictDialogProps = {
  conflict: Conflict;
  onKeepExisting: () => void;
  onReplace: () => void;
  onDismiss: () => void;
};

function ItemVersion({ label, item }: { label: string; item: CustomerPlateItem }) {
  return (
    <section className="min-w-0 rounded-xl border border-[#EAE4DF] bg-[#FAFAF9] p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">{label}</p>
      <p className="truncate text-sm font-semibold text-[#1F2937]">{item.name}</p>
      <p className="mt-1 text-sm text-[#374151]">{item.portionWeightInGrams} g</p>
      {item.observation && (
        <p className="mt-2 break-words text-sm text-[#6B7280]">Observação: {item.observation}</p>
      )}
    </section>
  );
}

export function PlateItemConflictDialog({
  conflict,
  onKeepExisting,
  onReplace,
  onDismiss,
}: PlateItemConflictDialogProps) {
  return (
    <Dialog open={Boolean(conflict)} onOpenChange={open => { if (!open) onDismiss(); }}>
      <DialogContent className="max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-2xl overflow-y-auto border-[#EAE4DF] bg-white">
        <DialogHeader>
          <DialogTitle>Este prato já está no seu pedido</DialogTitle>
          <DialogDescription>Você já adicionou este prato. Qual versão deseja manter?</DialogDescription>
        </DialogHeader>

        {conflict && (
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <ItemVersion label="Primeira inserção" item={conflict.existingItem} />
            <ItemVersion label="Nova inserção" item={conflict.incomingItem} />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" size="md" onClick={onKeepExisting}>
            Manter primeira inserção
          </Button>
          <Button variant="primary" size="md" onClick={onReplace}>
            Usar nova inserção
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
