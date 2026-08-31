"use client";

import { useState } from "react";

type Tone = "professional" | "friendly" | "concise";
type ApiResponse =
  | { bio: string; source: "ai" | "fallback" }
  | { error: string };

export default function GeneratorPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [interests, setInterests] = useState("");
  const [tone, setTone] = useState<Tone>("professional");

  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const canGenerate = name.trim() && role.trim();

  async function generate() {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, interests, tone }),
      });

      const data = (await res.json()) as ApiResponse;

      if (!res.ok || "error" in data) {
        setStatus("error");
        setMessage("error" in data ? data.error : "Generation failed.");
        return;
      }

      setBio(data.bio);
      setStatus("success");
      setMessage(data.source === "fallback" ? "Used fallback (AI unavailable)." : "Bio generated.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Bio Generator</h1>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (canGenerate) generate();
        }}
        noValidate
      >
        <div>
          <label className="block font-medium" htmlFor="name">Name *</label>
          <input
            id="name"
            className="mt-1 w-full rounded border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium" htmlFor="role">Role *</label>
          <input
            id="role"
            className="mt-1 w-full rounded border p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium" htmlFor="interests">Interests</label>
          <input
            id="interests"
            className="mt-1 w-full rounded border p-2"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium" htmlFor="tone">Tone</label>
          <select
            id="tone"
            className="mt-1 w-full rounded border p-2"
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="concise">Concise</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={!canGenerate || status === "loading"}
          aria-describedby="help"
        >
          {status === "loading" ? "Generating..." : "Generate Bio"}
        </button>

        <p id="help" className="text-sm text-gray-600">
          Name and role are required.
        </p>

        <div role="status" aria-live="polite" className="text-sm">
          {status === "error" && <p className="text-red-700">{message}</p>}
          {status === "success" && <p className="text-green-700">{message}</p>}
        </div>

        <div>
          <label className="block font-medium" htmlFor="bio">Bio (editable)</label>
          <textarea
            id="bio"
            className="mt-1 w-full rounded border p-2"
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="rounded border px-4 py-2"
          disabled={!bio}
          onClick={async () => navigator.clipboard.writeText(bio)}
        >
          Copy Bio
        </button>
      </form>
    </main>
  );
}