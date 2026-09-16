const ZOMATO_MCP_URL = "https://mcp-server.zomato.com/mcp";

type JsonRpcResponse<T = unknown> = {
  result?: T;
  error?: { code: number; message: string; data?: unknown };
};

async function readMcpResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};

  // Streamable HTTP may return JSON directly or an SSE envelope.
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/event-stream")) {
    const dataLines = text
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .filter(Boolean);
    const last = dataLines.at(-1);
    return last ? JSON.parse(last) : {};
  }

  return JSON.parse(text);
}

async function mcpPost(body: unknown, accessToken: string, sessionId?: string) {
  const response = await fetch(ZOMATO_MCP_URL, {
    method: "POST",
    headers: {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Zomato MCP HTTP ${response.status}: ${detail.slice(0, 500)}`);
  }

  return {
    body: await readMcpResponse(response),
    sessionId: response.headers.get("Mcp-Session-Id") || sessionId,
  };
}

export async function callZomatoTool<T = unknown>(
  toolName: string,
  args: Record<string, unknown> = {},
  accessToken = process.env.ZOMATO_MCP_ACCESS_TOKEN,
) {
  if (!accessToken) {
    throw new Error("ZOMATO_MCP_ACCESS_TOKEN is not configured");
  }

  const initialize = await mcpPost(
    {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "IFD", version: "0.1.0" },
      },
    },
    accessToken,
  );

  const init = initialize.body as JsonRpcResponse;
  if (init.error) throw new Error(`Zomato MCP initialize failed: ${init.error.message}`);

  await mcpPost(
    {
      jsonrpc: "2.0",
      method: "notifications/initialized",
      params: {},
    },
    accessToken,
    initialize.sessionId || undefined,
  );

  const toolCall = await mcpPost(
    {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: { name: toolName, arguments: args },
    },
    accessToken,
    initialize.sessionId || undefined,
  );

  const result = toolCall.body as JsonRpcResponse<T>;
  if (result.error) throw new Error(`Zomato MCP tool failed: ${result.error.message}`);
  return result.result as T;
}

export function isZomatoMcpConfigured() {
  return Boolean(process.env.ZOMATO_MCP_ACCESS_TOKEN);
}
