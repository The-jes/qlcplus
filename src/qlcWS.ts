import streamDeck from "@elgato/streamdeck";
import WebSocket, { Data, MessageEvent } from "ws";
import { EventEmitter } from "events";

//Initiate WebSocket connection
export class qlcConector extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: URL;
  private reconnectInterval: number = 1000;
  private reconnectAtempts: number = 0;
  private reconnectatempsMax: number = 20;

  constructor(url: URL) {
    super();
    this.url = url;
    streamDeck.logger.debug("QlcWC Loaded");
  }

  /**
   * Connect to Qlc+ via the Websocket endpoint
   */
  public connect(): void {
    if (this.ws) {
      streamDeck.logger.error("WS already Connected");
      return;
    }
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      streamDeck.logger.debug("WS opened");
    };
    this.ws.onerror = (error: any) => {
      streamDeck.logger.error("An error occured");
    };
    this.ws.onmessage = (event: MessageEvent) => {
      streamDeck.logger.info(event.data);
      this.emit("qlcmessage", event.data);
    };
    this.ws.onclose = () => {
      streamDeck.logger.error("WS Closed, Trying to reopen:");
      this.reconnect();
    };
  }
  /**
   * Send a command to Qlc+ via Websocket
   */
  public send(message: string): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
      return true;
    } else {
      streamDeck.logger.error("Cannot send message. WebSocket is not open.");
      this.reconnect();
      return false;
    }
  }

  /**
   * Reconnect the WS on Lost connection
   */
  private reconnect(): void {
    if (this.reconnectAtempts > this.reconnectatempsMax) {
      this.reconnectAtempts = 0;
      streamDeck.logger.error(
        "Max Reconnect Atemps Reached, waiting on action from user"
      );
      return;
    }
    streamDeck.logger.debug(
      "Reconnection Initiatet(" + this.reconnectAtempts + ")"
    );
    this.ws = null;
    this.reconnectAtempts++;
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }
}
