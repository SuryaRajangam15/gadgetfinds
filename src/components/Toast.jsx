import React, { useEffect } from "react";
import { useToastState, setToastFn } from "../hooks/useToast";

export default function Toast() {
  const { toasts, add } = useToastState();
  useEffect(() => {
    setToastFn(add);
  }, [add]);
  if (!toasts.length) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} className={"toast" + (t.type ? " " + t.type : "")}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
