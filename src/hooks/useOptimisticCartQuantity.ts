"use client";

import { startTransition, useOptimistic } from "react";

type CartOptimisticAction = "add" | "increase" | "decrease" | "remove";

export const useOptimisticCartQuantity = (
  cartQuantity: number,
  maxStock: number
) => {
  const [optimisticCartQuantity, applyCartOptimistic] = useOptimistic(
    cartQuantity,
    (currentQuantity: number, action: CartOptimisticAction) => {
      if (action === "remove") return 0;
      if (action === "decrease") return Math.max(0, currentQuantity - 1);
      return Math.min(maxStock, currentQuantity + 1);
    }
  );

  const runOptimisticAction = (action: CartOptimisticAction): void => {
    // React 19 requires optimistic updates to run inside a transition/action.
    startTransition(() => {
      applyCartOptimistic(action);
    });
  };

  return {
    optimisticCartQuantity,
    isInCart: optimisticCartQuantity > 0,
    canIncreaseQuantity: optimisticCartQuantity < maxStock,
    runOptimisticAction,
  };
};
