"use client";

import { useState, useEffect, useRef } from "react";
import { X, Tag, Plus, ChevronDown } from "lucide-react";

interface Props {
  selected: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
}

export default function TagSelector({
  selected,
  onChange,
  label = "TAGS",
  placeholder = "Buscar ou criar tag...",
}: Props) {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch existing tags from API
  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((data: string[]) => setAllTags(data))
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = allTags.filter(
    (t) =>
      t.toLowerCase().includes(input.toLowerCase()) &&
      !selected.includes(t)
  );

  const inputIsNew = input.trim() !== "" && !allTags.some(
    (t) => t.toLowerCase() === input.trim().toLowerCase()
  );

  const add = (tag: string) => {
    const t = tag.trim();
    if (!t || selected.includes(t)) return;
    onChange([...selected, t]);
    // Refresh tag list so the new tag appears next time
    if (!allTags.includes(t)) setAllTags((prev) => [...prev, t].sort((a, b) => a.localeCompare(b)));
    setInput("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const remove = (tag: string) => onChange(selected.filter((t) => t !== tag));

  const showDropdown = open && (suggestions.length > 0 || inputIsNew);

  return (
    <div ref={containerRef}>
      <label className="flex items-center gap-1 text-xs font-black uppercase tracking-widest mb-2">
        <Tag size={12} />
        {label}
      </label>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selected.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 text-xs font-bold"
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                className="hover:opacity-70 transition"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <div className="flex items-center border-2 border-border focus-within:border-accent bg-background transition">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === ",") && input.trim()) {
                e.preventDefault();
                // If there's an exact match in suggestions, use it; otherwise create new
                const exact = allTags.find(
                  (t) => t.toLowerCase() === input.trim().toLowerCase()
                );
                add(exact ?? input.trim());
              }
              if (e.key === "Escape") setOpen(false);
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                (containerRef.current?.querySelector("[data-suggestion]") as HTMLElement)?.focus();
              }
            }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2.5 text-sm font-medium bg-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => { setOpen((v) => !v); inputRef.current?.focus(); }}
            className="px-2 text-muted-foreground hover:text-foreground transition"
          >
            <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 z-50 bg-card border-2 border-border border-t-0 max-h-52 overflow-y-auto shadow-lg">
            {/* Existing matching tags */}
            {suggestions.map((tag, i) => (
              <button
                key={tag}
                data-suggestion={i === 0 ? "first" : undefined}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); add(tag); }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition flex items-center gap-2"
              >
                <Tag size={12} className="text-accent shrink-0" />
                {tag}
              </button>
            ))}

            {/* Divider when both exist */}
            {suggestions.length > 0 && inputIsNew && (
              <div className="border-t border-border" />
            )}

            {/* Create new option */}
            {inputIsNew && (
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); add(input.trim()); }}
                className="w-full text-left px-3 py-2.5 text-sm font-bold hover:bg-accent hover:text-accent-foreground transition flex items-center gap-2"
              >
                <Plus size={12} className="shrink-0" />
                Criar &ldquo;{input.trim()}&rdquo;
              </button>
            )}
          </div>
        )}

        {/* Empty state when open but no suggestions */}
        {open && !showDropdown && allTags.length > 0 && !input && (
          <div className="absolute top-full left-0 right-0 z-50 bg-card border-2 border-border border-t-0 max-h-52 overflow-y-auto shadow-lg">
            {allTags
              .filter((t) => !selected.includes(t))
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); add(tag); }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition flex items-center gap-2"
                >
                  <Tag size={12} className="text-accent shrink-0" />
                  {tag}
                </button>
              ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-1">
        Selecione existentes ou digite e pressione <kbd className="px-1 border border-border text-xs">Enter</kbd> para criar nova
      </p>
    </div>
  );
}
