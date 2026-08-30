"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SendIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { botCopy } from "@/components/rate-me/landing-copy";
import { cn } from "@/lib/utils";

type ChatLine = {
  id: string;
  from: "bot" | "user";
  text: string;
};

const WELCOME_MESSAGE = botCopy.welcomeEn;

export function RaytmeBot({ arabic = false }: { arabic?: boolean }) {
  const welcome = arabic ? botCopy.welcomeAr : botCopy.welcomeEn;
  const setup = arabic ? botCopy.setupAr : botCopy.setupEn;
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatLine[]>([
    { id: "welcome", from: "bot", text: WELCOME_MESSAGE },
  ]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const displayedMessages = messages.map((line) => {
    if (line.id === "welcome") return { ...line, text: welcome };
    if (
      line.from === "bot" &&
      (line.text === botCopy.setupEn || line.text === botCopy.setupAr)
    ) {
      return { ...line, text: setup };
    }
    return line;
  });

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, open]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((current) => [
      ...current,
      { id: `user-${current.length}`, from: "user", text },
      {
        id: `bot-${current.length}`,
        from: "bot",
        text: setup,
      },
    ]);
  }

  return (
    <div className="fixed end-5 bottom-16 z-50 flex flex-col items-end gap-3">
      {open ? (
        <Card
          role="dialog"
          aria-labelledby="raytme-bot-title"
          className="w-[min(22.5rem,calc(100vw-2.5rem))] overflow-hidden border-white/10 bg-slate-900/90 shadow-[0_0_50px_-12px_rgba(139,92,246,0.35)] backdrop-blur-xl"
        >
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarImage src="/logo-mark.png" alt="" />
                <AvatarFallback className="bg-black text-white">R</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle id="raytme-bot-title" className="font-brand">
                  RaytME Bot
                </CardTitle>
                <CardDescription>Frontend preview</CardDescription>
              </div>
            </div>
            <CardAction>
              <Badge variant="outline">Not connected</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0">
            <div
              ref={scrollerRef}
              className="flex h-56 flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              {displayedMessages.map((line) => (
                <div
                  key={line.id}
                  className={cn(
                    "flex",
                    line.from === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <p
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-5",
                      line.from === "user"
                        ? "bg-white text-black"
                        : "bg-white/[0.06] text-white/85",
                    )}
                  >
                    {line.text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <form
              className="flex w-full items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={arabic ? botCopy.placeholderAr : botCopy.placeholderEn}
                aria-label={arabic ? "رسالة إلى RaytME Bot" : "Message RaytME Bot"}
                autoComplete="off"
                className="rounded-full border-white/[0.08] bg-white/[0.04]"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full"
                aria-label={arabic ? "إرسال الرسالة" : "Send message"}
              >
                <SendIcon />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : null}
      <Button
        type="button"
        size="icon-lg"
        aria-label={open ? (arabic ? "إغلاق RaytME Bot" : "Close RaytME Bot") : arabic ? "فتح RaytME Bot" : "Open RaytME Bot"}
        aria-expanded={open}
        aria-controls="raytme-bot-title"
        className="size-14 overflow-hidden rounded-full border border-white/15 bg-black p-0 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] hover:bg-black/90"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <XIcon className="text-white" />
        ) : (
          <Image
            src="/logo-mark.png"
            alt=""
            width={112}
            height={112}
            className="size-full rounded-full object-cover"
          />
        )}
      </Button>
    </div>
  );
}
