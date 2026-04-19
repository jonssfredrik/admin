"use client";

import { useEffect, useState } from "react";
import { Save, StickyNote, Tag, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/toast/ToastProvider";
import { useDomainNotes } from "@/modules/snaptld/lib/notes";

export function NotesCard({ slug, domain }: { slug: string; domain: string }) {
  const toast = useToast();
  const notes = useDomainNotes();
  const existing = notes.get(slug);

  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!notes.hydrated) return;
    setText(existing?.text ?? "");
    setTags(existing?.tags ?? []);
  }, [notes.hydrated, existing?.text, existing?.tags]);

  const dirty =
    text !== (existing?.text ?? "") ||
    tags.length !== (existing?.tags.length ?? 0) ||
    tags.some((t, i) => t !== existing?.tags[i]);

  const addTag = () => {
    const v = tagInput.trim().toLowerCase();
    if (!v || tags.includes(v)) {
      setTagInput("");
      return;
    }
    setTags([...tags, v]);
    setTagInput("");
  };

  const save = () => {
    notes.set(slug, text, tags);
    toast.success("Anteckning sparad", domain);
  };

  return (
    <Card>
      <div className="flex items-center gap-2">
        <StickyNote size={14} className="text-muted" />
        <h3 className="text-sm font-semibold">Anteckningar & taggar</h3>
        {existing && (
          <span className="ml-auto font-mono text-[11px] text-muted">
            Uppdaterad {new Date(existing.updatedAt).toLocaleDateString("sv-SE")}
          </span>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Egna observationer, buds-taktik, kontakter…"
        className="mt-3 w-full resize-none rounded-lg border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-fg/30 focus:ring-2 focus:ring-fg/5"
      />

      <div className="mt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-md border bg-bg/40 px-2 py-0.5 text-xs"
            >
              <Tag size={10} className="text-muted" />
              {t}
              <button
                onClick={() => setTags(tags.filter((x) => x !== t))}
                className="text-muted hover:text-fg"
                aria-label={`Ta bort ${t}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
            }}
            onBlur={addTag}
            placeholder="Lägg till tagg…"
            className="h-7 w-40 text-xs"
          />
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Button className="h-8 gap-1.5 px-3 text-xs" disabled={!dirty} onClick={save}>
          <Save size={12} />
          Spara
        </Button>
      </div>
    </Card>
  );
}
