"use client";
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { APP_TOAST_EVENT, AppToastDetail } from "@/utils/toast";

const TOAST_DURATION = 3200;

const slideIn = keyframes`
  from { opacity: 0; transform: translate(-50%, 16px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
`;

const StyledToast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  z-index: 10000;
  max-width: calc(100vw - 40px);
  padding: 14px 20px 14px 16px;
  border-radius: 12px;
  border: 1px solid #ffffff1f;
  border-left: 3px solid #f7cb57;
  background: #1a1a1af2;
  backdrop-filter: blur(24px);
  box-shadow: 0 14px 32px -8px #00000099;
  color: #ffffff;
  font-family: "Helvetica", sans-serif;
  font-size: 15px;
  line-height: 20px;
  animation: ${slideIn} 0.2s ease-out;
  pointer-events: none;

  @media (max-width: 1080px) {
    bottom: 20px;
    font-size: 14px;
  }
`;

type Props = {
  dictionary: any;
};

const Toast = ({ dictionary }: Props) => {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const resolveMessage = (detail: AppToastDetail): string => {
      if (detail.kind === "message") return detail.message;
      const template: string =
        dictionary?.stock?.limitReached || "Only {count} in stock - you can't add more";
      const count = detail.limit ?? 0;
      return template.replace("{count}", String(count));
    };

    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<AppToastDetail>).detail;
      if (!detail) return;
      setMessage(resolveMessage(detail));
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setMessage(null), TOAST_DURATION);
    };

    window.addEventListener(APP_TOAST_EVENT, onToast as EventListener);
    return () => {
      window.removeEventListener(APP_TOAST_EVENT, onToast as EventListener);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dictionary]);

  if (!message) return null;

  return (
    <StyledToast role="status" aria-live="polite">
      {message}
    </StyledToast>
  );
};

export default Toast;
