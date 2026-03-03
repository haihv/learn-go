import { NextRequest, NextResponse } from "next/server";

type PlaygroundEvent = {
  Message: string;
  Kind: "stdout" | "stderr" | string;
  Delay: number;
};

type PlaygroundResponse = {
  Errors: string;
  Events: PlaygroundEvent[] | null;
  Status: number;
};

type RunResult = {
  stdout: string;
  stderr: string;
  error: string | null;
  timedOut: boolean;
};

export async function POST(req: NextRequest): Promise<NextResponse<RunResult>> {
  const { code } = (await req.json()) as { code: string };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch("https://go.dev/play/p/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version: 2, body: code }),
      signal: controller.signal,
    });

    const data = (await res.json()) as PlaygroundResponse;

    let stdout = "";
    let stderr = data.Errors ?? "";

    for (const event of data.Events ?? []) {
      if (event.Kind === "stdout") stdout += event.Message;
      else if (event.Kind === "stderr") stderr += event.Message;
    }

    return NextResponse.json({ stdout, stderr, error: null, timedOut: false });
  } catch (err) {
    const timedOut = (err as Error).name === "AbortError";
    return NextResponse.json(
      {
        stdout: "",
        stderr: "",
        error: timedOut ? "timeout" : String(err),
        timedOut,
      },
      { status: timedOut ? 504 : 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
