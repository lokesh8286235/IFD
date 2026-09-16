import { NextRequest, NextResponse } from "next/server";
import { callZomatoTool, isZomatoMcpConfigured } from "@/lib/mcp/zomato";

export async function GET() {
  return NextResponse.json({
    provider: "zomato",
    configured: isZomatoMcpConfigured(),
    endpoint: "https://mcp-server.zomato.com/mcp",
    status: isZomatoMcpConfigured() ? "ready" : "awaiting_oauth_access",
  });
}

export async function POST(request: NextRequest) {
  if (!isZomatoMcpConfigured()) {
    return NextResponse.json(
      { error: "Zomato MCP access is not configured for this deployment." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const tool = typeof body?.tool === "string" ? body.tool : "";
    const args = body?.arguments && typeof body.arguments === "object" ? body.arguments : {};

    if (!tool) {
      return NextResponse.json({ error: "tool is required" }, { status: 400 });
    }

    const result = await callZomatoTool(tool, args);
    return NextResponse.json({ provider: "zomato", tool, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Zomato MCP error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
