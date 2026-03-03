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
    // Use the form-encoded compile endpoint — more stable for programmatic access
    const body = new URLSearchParams({ body: code, version: "2" });
    const res = await fetch("https://play.golang.org/compile?output=json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });

    // Parse as text first so a non-JSON response (e.g. rate-limit HTML page)
    // is handled gracefully instead of throwing.
    const text = await res.text();
    let data: PlaygroundResponse;
    try {
      data = JSON.parse(text) as PlaygroundResponse;
    } catch {
      return NextResponse.json({
        stdout: "",
        stderr: "",
        error: "Go Playground is unavailable — please try again in a moment.",
        timedOut: false,
      });
    }

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
        error: timedOut ? "Execution timed out (10 s)" : String(err),
        timedOut,
      },
      { status: timedOut ? 504 : 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
