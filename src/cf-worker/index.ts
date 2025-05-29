import { makeDurableObject, makeWorker } from "@livestore/sync-cf/cf-worker";

export type JsonArray = ReadonlyArray<JsonValue>;

export interface JsonObject {
  [key: string]: JsonValue;
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

export class WebSocketServer extends makeDurableObject({
  onPush: async (message) => {
    console.log("onPush", message.batch);
  },
  onPull: async (message) => {
    console.log("onPull", message);
  },
}) {}

export default makeWorker({
  validatePayload: (payload: JsonValue | undefined): void | Promise<void> => {
    if (
      typeof payload === "object" &&
      payload !== null &&
      !Array.isArray(payload) &&
      "authToken" in payload &&
      payload.authToken !== "insecure-token-change-me"
    ) {
      throw new Error("Invalid auth token");
    }
  },
  enableCORS: true,
});
