import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import RequestModal from "./RequestModal";

export default function RequestButton() {
  const [open, setOpen] = useState(false);

  const location = useLocation();

  // HIDE ON ADMIN PAGES
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <button className="request-float-btn" onClick={() => setOpen(true)}>
        ✨ Request Gadget
      </button>

      {open && <RequestModal onClose={() => setOpen(false)} />}
    </>
  );
}
