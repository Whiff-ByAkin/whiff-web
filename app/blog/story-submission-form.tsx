"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MAX_STORY_LENGTH = 2000;
const MAX_NICKNAME_LENGTH = 40;
const MAX_EMAIL_LENGTH = 254;
const BOT_REPLY_MAX_HEIGHT = 256;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The proxy often answers faster than feels human, so the "thinking..." state
// flashes and gone. Hold it for a random 2-3s minimum so whiff reads like it
// actually paused to consider what you said.
const THINK_MIN_MS = 2000;
const THINK_MAX_MS = 3000;

function randomThinkMs() {
  return THINK_MIN_MS + Math.random() * (THINK_MAX_MS - THINK_MIN_MS);
}

// Wait out the remainder of `minMs` measured from `startedAt`. If the request
// already took longer, this resolves immediately and adds nothing.
function waitOutThinking(startedAt: number, minMs: number) {
  const remaining = minMs - (Date.now() - startedAt);
  if (remaining <= 0) return Promise.resolve();
  return new Promise<void>((resolve) => setTimeout(resolve, remaining));
}

const inputClass =
  "w-full rounded-[8px] border border-forest/15 bg-oat/60 px-4 py-3 text-base text-forest placeholder:text-forest/60 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/10";

type CreditMode = "anonymous" | "nickname";
type ShareMode = "bot" | "free";
type FormStep = "choose" | "bot" | "free" | "preview";
type SubmitState = "idle" | "submitting" | "success" | "error";
type AiState = "idle" | "chatting" | "summarizing";
type BotMessage = {
  role: "assistant" | "user";
  content: string;
};

type StorySummary = {
  title?: string;
  story?: string;
  tags?: string[];
};

const INITIAL_BOT_MESSAGE =
  "tell me what dating apps reminded you of this time. the whole thing, not the polite version.";

export function StorySubmissionForm() {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>("choose");
  const [shareMode, setShareMode] = useState<ShareMode | null>(null);
  const [story, setStory] = useState("");
  const [storyLabel, setStoryLabel] = useState("");
  const [storyTags, setStoryTags] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [botMessages, setBotMessages] = useState<BotMessage[]>([
    { role: "assistant", content: INITIAL_BOT_MESSAGE },
  ]);
  const [botReply, setBotReply] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [aiState, setAiState] = useState<AiState>("idle");
  const [botError, setBotError] = useState("");
  const [creditMode, setCreditMode] = useState<CreditMode>("anonymous");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const storyIsValid = step === "preview" && story.trim().length > 0;
  const nicknameIsValid =
    creditMode === "anonymous" || nickname.trim().length > 0;
  const emailIsValid =
    email.trim().length === 0 || EMAIL_PATTERN.test(email.trim());
  const canSubmit =
    storyIsValid &&
    nicknameIsValid &&
    emailIsValid &&
    submitState !== "submitting" &&
    aiState === "idle";

  function chooseMode(mode: ShareMode) {
    setShareMode(mode);
    setStep(mode);
    setStory("");
    setStoryLabel("");
    setStoryTags([]);
    setBotError("");
    setMessage("");
    if (submitState !== "submitting") setSubmitState("idle");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: story.trim(),
          creditMode,
          nickname: nickname.trim(),
          email: email.trim(),
          label: storyLabel,
          tags: storyTags,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "We could not save your story right now.");
      }

      resetAll();
      setSubmitState("success");
      setMessage("Your story was added to the archive. Thank you for sharing your side.");
      router.refresh();
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not save your story right now.",
      );
    }
  }

  async function sendBotReply() {
    const reply = botReply.trim();
    if (!reply || aiState !== "idle") return;

    const nextMessages: BotMessage[] = [
      ...botMessages,
      { role: "user", content: reply },
    ];

    setBotMessages(nextMessages);
    setBotReply("");
    setReplyOpen(false);
    clearDraft();
    setBotError("");
    setAiState("chatting");
    if (submitState !== "submitting") setSubmitState("idle");

    const startedAt = Date.now();
    const minThink = randomThinkMs();

    try {
      const response = await fetch("/api/story-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "chat", messages: nextMessages }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok || !data.reply?.trim()) {
        throw new Error(data.error || "whiff bot could not reply right now.");
      }

      await waitOutThinking(startedAt, minThink);

      setBotMessages([
        ...nextMessages,
        { role: "assistant", content: ensureArchivePrompt(data.reply.trim()) },
      ]);
    } catch (error) {
      setBotError(
        error instanceof Error
          ? error.message
          : "whiff bot could not reply right now.",
      );
    } finally {
      setAiState("idle");
    }
  }

  async function makeBotDraft() {
    if (aiState !== "idle" || !botMessages.some((botMessage) => botMessage.role === "user")) {
      return;
    }

    await makeDraftFromMessages(botMessages);
  }

  async function makeFreeDraft() {
    const freeStory = freeText.trim();
    if (!freeStory || aiState !== "idle") return;

    await makeDraftFromMessages([
      { role: "assistant", content: INITIAL_BOT_MESSAGE },
      { role: "user", content: freeStory },
    ]);
  }

  async function makeDraftFromMessages(messages: readonly BotMessage[]) {
    setBotError("");
    setAiState("summarizing");
    if (submitState !== "submitting") setSubmitState("idle");

    const startedAt = Date.now();
    const minThink = randomThinkMs();

    try {
      const response = await fetch("/api/story-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "summary", messages }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        summary?: StorySummary;
        error?: string;
      };
      const summaryStory = data.summary?.story?.trim();

      if (!response.ok || !summaryStory) {
        throw new Error(data.error || "whiff bot could not make the post.");
      }

      await waitOutThinking(startedAt, minThink);

      setStory(summaryStory);
      setStoryLabel(data.summary?.title?.trim() || "dating app experience");
      setStoryTags(cleanTags(data.summary?.tags, summaryStory));
      setReplyOpen(false);
      setStep("preview");
    } catch (error) {
      setBotError(
        error instanceof Error
          ? error.message
          : "whiff bot could not make the post.",
      );
    } finally {
      setAiState("idle");
    }
  }

  function addMoreToBotStory() {
    setReplyOpen(true);
    clearDraft();
    setBotError("");
    if (submitState !== "submitting") setSubmitState("idle");
  }

  function resetAll() {
    setStep("choose");
    setShareMode(null);
    setStory("");
    setStoryLabel("");
    setStoryTags([]);
    setFreeText("");
    setBotMessages([{ role: "assistant", content: INITIAL_BOT_MESSAGE }]);
    setBotReply("");
    setReplyOpen(false);
    setBotError("");
    setNickname("");
    setEmail("");
    setCreditMode("anonymous");
  }

  function clearDraft() {
    setStory("");
    setStoryLabel("");
    setStoryTags([]);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
      {message && (
        <StatusMessage submitState={submitState}>{message}</StatusMessage>
      )}

      {step === "choose" && (
        <ChooseStep onChoose={chooseMode} />
      )}

      {step === "bot" && (
        <BotStoryStep
          messages={botMessages}
          reply={botReply}
          replyOpen={replyOpen}
          aiState={aiState}
          error={botError}
          onReplyChange={(value) => {
            setBotReply(value);
            if (submitState !== "submitting") setSubmitState("idle");
          }}
          onSendReply={sendBotReply}
          onMakeDraft={makeBotDraft}
          onAddMore={addMoreToBotStory}
        />
      )}

      {step === "free" && (
        <FreeWriteStep
          value={freeText}
          aiState={aiState}
          error={botError}
          onChange={(value) => {
            setFreeText(value);
            clearDraft();
            setBotError("");
            if (submitState !== "submitting") setSubmitState("idle");
          }}
          onMakeDraft={makeFreeDraft}
        />
      )}

      {step === "preview" && (
        <PreviewStep
          title={storyLabel}
          story={story}
          tags={storyTags}
          creditMode={creditMode}
          nickname={nickname}
          email={email}
          submitState={submitState}
          canSubmit={canSubmit}
          onCreditModeChange={setCreditMode}
          onNicknameChange={(value) => {
            setNickname(value);
            if (submitState !== "submitting") setSubmitState("idle");
          }}
          onEmailChange={(value) => {
            setEmail(value);
            if (submitState !== "submitting") setSubmitState("idle");
          }}
          onBack={() => {
            setStep(shareMode === "free" ? "free" : "bot");
            if (submitState !== "submitting") setSubmitState("idle");
          }}
        />
      )}
    </form>
  );
}

function ChooseStep({ onChoose }: { onChoose: (mode: ShareMode) => void }) {
  return (
    <section className="space-y-6 py-2 text-center">
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-forest/60">
          join our movement
        </p>
        <h2 className="mx-auto max-w-md font-serif text-3xl font-semibold leading-tight text-forest md:text-4xl">
          we are anti dating apps too
        </h2>
      </div>

      <div className="mx-auto max-w-sm space-y-3">
        <button
          type="button"
          onClick={() => onChoose("bot")}
          className="group w-full rounded-full border border-sienna/35 bg-sienna px-6 py-4 font-serif text-lg font-semibold italic text-oat shadow-[0_18px_54px_-32px_rgba(120,44,26,0.7)] transition hover:-translate-y-0.5 hover:bg-sienna-hover"
        >
          rant about your experience
          <span className="mt-1 block font-sans text-xs font-normal not-italic leading-relaxed text-oat/78">
            we are gathering stories
          </span>
        </button>
        <button
          type="button"
          onClick={() => onChoose("free")}
          className="text-sm text-forest/60 underline-offset-4 transition hover:text-forest hover:underline"
        >
          free write
        </button>
      </div>
    </section>
  );
}

function BotStoryStep({
  messages,
  reply,
  replyOpen,
  aiState,
  error,
  onReplyChange,
  onSendReply,
  onMakeDraft,
  onAddMore,
}: {
  messages: readonly BotMessage[];
  reply: string;
  replyOpen: boolean;
  aiState: AiState;
  error: string;
  onReplyChange: (value: string) => void;
  onSendReply: () => void;
  onMakeDraft: () => void;
  onAddMore: () => void;
}) {
  const busy = aiState !== "idle";
  const hasUserMessage = messages.some((message) => message.role === "user");
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");
  const showArchiveActions =
    hasUserMessage &&
    !replyOpen &&
    isArchivePostPrompt(lastAssistantMessage?.content);
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  // Keep the newest message (and the typing indicator) in view as the
  // conversation grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, aiState]);

  useEffect(() => {
    const el = replyRef.current;
    if (!el) return;

    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, BOT_REPLY_MAX_HEIGHT);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY =
      el.scrollHeight > BOT_REPLY_MAX_HEIGHT ? "auto" : "hidden";
  }, [reply, replyOpen]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSendReply();
    }
  }

  return (
    <section className="space-y-4">
      <p className="font-serif text-lg font-semibold italic leading-snug text-forest/70 sm:text-xl">
        &ldquo;we listen and dont judge&rdquo;
      </p>

      <div
        ref={scrollRef}
        className="max-h-64 space-y-4 overflow-y-auto pr-1 md:max-h-80"
      >
        {messages.map((message, index) =>
          message.role === "assistant" ? (
            <BotBubble key={`${message.role}-${index}-${message.content}`}>
              {message.content}
            </BotBubble>
          ) : (
            <UserBubble key={`${message.role}-${index}-${message.content}`}>
              {message.content}
            </UserBubble>
          ),
        )}
        {aiState === "chatting" && <TypingBubble />}
      </div>

      {showArchiveActions ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onMakeDraft}
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-sienna px-4 font-serif text-sm italic text-oat transition hover:bg-sienna-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {aiState === "summarizing" ? "making..." : "make the post"}
          </button>
          <button
            type="button"
            onClick={onAddMore}
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-sienna/30 bg-oat/70 px-4 font-serif text-sm italic text-forest transition hover:bg-sienna hover:text-oat disabled:cursor-not-allowed disabled:opacity-50"
          >
            add more
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          <label htmlFor="bot-reply" className="sr-only">
            Message to whiff
          </label>
          <div className="relative">
            <textarea
              ref={replyRef}
              id="bot-reply"
              rows={3}
              value={reply}
              onChange={(event) => onReplyChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell whiff what happened..."
              className={`${inputClass} max-h-64 min-h-32 resize-none overflow-hidden py-3 pr-14 leading-[1.6]`}
            />
            <button
              type="button"
              onClick={onSendReply}
              disabled={reply.trim().length === 0 || busy}
              aria-label="Send message"
              className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-sienna text-oat transition hover:bg-sienna-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {aiState === "chatting" ? (
                <span className="typing-spinner" aria-hidden="true" />
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              )}
            </button>
          </div>
          <p className="pl-1 text-[11px] text-forest/50">
            Press Enter to send, Shift + Enter for a new line.
          </p>
        </div>
      )}

      {aiState === "summarizing" && (
        <p className="flex items-center gap-2 rounded-2xl border border-sienna/20 bg-sienna/10 p-3 text-sm leading-relaxed text-forest/76">
          <span className="typing-spinner-sienna" aria-hidden="true" />
          whiff is turning it into an archive post...
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm leading-relaxed text-red-900/78">
          {error}
        </p>
      )}
    </section>
  );
}

function FreeWriteStep({
  value,
  aiState,
  error,
  onChange,
  onMakeDraft,
}: {
  value: string;
  aiState: AiState;
  error: string;
  onChange: (value: string) => void;
  onMakeDraft: () => void;
}) {
  const busy = aiState !== "idle";

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="free-story" className="sr-only">
          Tell the story
        </label>
        <textarea
          id="free-story"
          rows={8}
          maxLength={MAX_STORY_LENGTH}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Tell the story..."
          className={`${inputClass} min-h-48 resize-y leading-[1.75]`}
        />
        <p className="text-right text-xs text-forest/65">
          {value.length}/{MAX_STORY_LENGTH} characters
        </p>
      </div>

      <button
        type="button"
        onClick={onMakeDraft}
        disabled={value.trim().length === 0 || busy}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-sienna px-5 font-serif text-sm italic text-oat transition hover:bg-sienna-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {aiState === "summarizing" ? "making..." : "make the post"}
      </button>

      {error && (
        <p role="alert" className="text-sm leading-relaxed text-red-900/78">
          {error}
        </p>
      )}
    </section>
  );
}

function PreviewStep({
  title,
  story,
  tags,
  creditMode,
  nickname,
  email,
  submitState,
  canSubmit,
  onCreditModeChange,
  onNicknameChange,
  onEmailChange,
  onBack,
}: {
  title: string;
  story: string;
  tags: readonly string[];
  creditMode: CreditMode;
  nickname: string;
  email: string;
  submitState: SubmitState;
  canSubmit: boolean;
  onCreditModeChange: (value: CreditMode) => void;
  onNicknameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onBack: () => void;
}) {
  return (
    <section className="space-y-5">
      <div className="rounded-[8px] border border-forest/15 bg-oat/52 p-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-forest/60">
          preview
        </p>
        <PreviewBlock label="title">{title || "dating app experience"}</PreviewBlock>
        <PreviewBlock label="story">{story}</PreviewBlock>
        <PreviewBlock label="tags">
          {tags.length > 0 ? tags.join(", ") : "app fatigue"}
        </PreviewBlock>
      </div>

      <fieldset className="space-y-2">
        <legend className="font-serif text-lg font-semibold text-forest">
          show as:
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <CreditOption
            checked={creditMode === "anonymous"}
            label="anonymous"
            onChange={() => onCreditModeChange("anonymous")}
          />
          <CreditOption
            checked={creditMode === "nickname"}
            label="nickname"
            onChange={() => onCreditModeChange("nickname")}
          />
        </div>
      </fieldset>

      {creditMode === "nickname" && (
        <div className="space-y-2">
          <label htmlFor="nickname" className="font-serif text-base font-semibold text-forest">
            nickname
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            maxLength={MAX_NICKNAME_LENGTH}
            value={nickname}
            onChange={(event) => onNicknameChange(event.target.value)}
            placeholder="Example: Tired in Chicago"
            className={inputClass}
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="font-serif text-base font-semibold text-forest">
          email for your free founder badge:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={MAX_EMAIL_LENGTH}
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
        <p className="text-xs leading-relaxed text-forest/62">
          Optional. We promise this is not for marketing or promotions, just a
          little thank-you for helping start the wall.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-sienna px-6 font-serif text-base italic text-oat shadow-[0_14px_30px_-18px_rgba(120,44,26,0.7)] transition hover:bg-sienna-hover disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canSubmit}
        >
          {submitState === "submitting" ? "adding..." : "add to archive"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-forest/15 bg-oat/45 px-5 font-serif text-sm italic text-forest/72 transition hover:border-forest/35 hover:text-forest"
        >
          edit
        </button>
      </div>
    </section>
  );
}

function PreviewBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <p className="font-serif text-base font-semibold leading-tight text-forest">
        {label}:
      </p>
      <p className="mt-1 text-sm leading-[1.75] text-forest/76">{children}</p>
    </div>
  );
}

function StatusMessage({
  submitState,
  children,
}: {
  submitState: SubmitState;
  children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-[8px] border p-4 text-sm leading-[1.7] ${
        submitState === "success"
          ? "border-sienna/25 bg-sienna/10 text-forest"
          : "border-red-900/20 bg-red-900/5 text-forest"
      }`}
    >
      {children}
    </div>
  );
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start">
      <p className="max-w-[88%] text-sm leading-relaxed text-forest/82">
        {children}
      </p>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[88%] border-r border-sienna/35 pr-3 text-right text-sm leading-relaxed text-forest/78">
        {children}
      </p>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div
        className="inline-flex items-center gap-1.5 py-2"
        role="status"
        aria-label="whiff is thinking"
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

function CreditOption({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-[8px] border px-4 py-3 text-sm transition ${
        checked
          ? "border-sienna/35 bg-sienna/10 text-forest"
          : "border-forest/15 bg-oat/50 text-forest/76 hover:border-forest/30"
      }`}
    >
      <input
        type="radio"
        name="creditMode"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-sienna"
      />
      <span>{label}</span>
    </label>
  );
}

function isArchivePostPrompt(value: string | undefined) {
  return /want me to turn this into an anonymous archive post\??/i.test(
    value ?? "",
  );
}

function ensureArchivePrompt(value: string) {
  if (isArchivePostPrompt(value)) return value;

  return `${value.trim()}\n\nwant me to turn this into an anonymous archive post?`;
}

function cleanTags(tags: unknown, story: string) {
  if (Array.isArray(tags)) {
    const cleaned = tags
      .map((tag) => (typeof tag === "string" ? tag.trim().replace(/\s+/g, " ") : ""))
      .filter(Boolean)
      .slice(0, 5);

    if (cleaned.length > 0) return cleaned;
  }

  return inferTags(story);
}

function inferTags(story: string) {
  const value = story.toLowerCase();
  const tags = ["app fatigue"];

  if (value.includes("compatible") || value.includes("match")) {
    tags.push("false compatibility");
  }
  if (value.includes("conversation") || value.includes("reply")) {
    tags.push("low effort");
  }
  if (value.includes("ghost")) {
    tags.push("ghosting");
  }

  return tags.slice(0, 3);
}
