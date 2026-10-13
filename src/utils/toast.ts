export const APP_TOAST_EVENT = "appToast";

export type AppToastDetail =
  | { kind: "stockLimit"; limit: number | null }
  | { kind: "message"; message: string };

const dispatch = (detail: AppToastDetail) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AppToastDetail>(APP_TOAST_EVENT, { detail }));
};

/** Tell the user that no more units of a product can be added to the cart. */
export const showStockLimitToast = (limit: number | null) =>
  dispatch({ kind: "stockLimit", limit });

export const showToast = (message: string) => dispatch({ kind: "message", message });
