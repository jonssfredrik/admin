"use client";

import { useState } from "react";

export type AsyncActionStatus = "idle" | "pending" | "success" | "error";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Något gick fel";
}

export function useAsyncAction() {
  const [status, setStatus] = useState<AsyncActionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return {
    status,
    errorMessage,
    isPending: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
    reset() {
      setStatus("idle");
      setErrorMessage(null);
    },
    async run<T>(action: () => Promise<T> | T) {
      setStatus("pending");
      setErrorMessage(null);
      try {
        const result = await action();
        setStatus("success");
        return result;
      } catch (error) {
        setStatus("error");
        setErrorMessage(getErrorMessage(error));
        throw error;
      }
    },
  };
}
