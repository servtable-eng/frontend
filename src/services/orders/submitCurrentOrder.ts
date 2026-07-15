export type OrderSubmissionGuard = {
  pending: boolean;
  successHandled: boolean;
};

type SubmitCurrentOrderOptions<TOrder> = {
  guard: OrderSubmissionGuard;
  create: () => Promise<TOrder>;
  saveRecentOrder: (order: TOrder) => void;
  clearCurrentOrder: () => void;
};

/**
 * Enforces the success transaction order and guards it against duplicate UI
 * events. A rejected request deliberately runs neither persistence nor cleanup.
 */
export async function submitCurrentOrder<TOrder>({
  guard,
  create,
  saveRecentOrder,
  clearCurrentOrder,
}: SubmitCurrentOrderOptions<TOrder>): Promise<TOrder | null> {
  if (guard.pending) return null;

  guard.pending = true;
  guard.successHandled = false;

  try {
    const createdOrder = await create();
    if (guard.successHandled) return null;

    guard.successHandled = true;
    saveRecentOrder(createdOrder);
    clearCurrentOrder();
    return createdOrder;
  } catch (error) {
    guard.successHandled = false;
    throw error;
  } finally {
    guard.pending = false;
  }
}
