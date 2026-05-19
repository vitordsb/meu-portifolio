"use client";

import { useActionState } from "react";
import { loginWithPassword } from "@/lib/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginWithPassword, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="card-brutalist p-8 w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="username">
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="border-2 border-[var(--foreground)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="border-2 border-[var(--foreground)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-brutalist-accent mt-2 disabled:opacity-50"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
