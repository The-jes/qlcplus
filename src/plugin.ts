import streamDeck from "@elgato/streamdeck";

import { button } from "./actions/button";
import { fader } from "./actions/fader";
import { qlcConector } from "./qlcWS";

/**
 * This is the plugin entrypoint
 * That means it is executet on startup!
 */

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
//streamDeck.logger.setLevel(LogLevel.DEBUG);

// Register the increment action.
streamDeck.actions.registerAction(new button());
streamDeck.actions.registerAction(new fader());

// Finally, connect to the Stream Deck.
streamDeck.connect();

export const qlc = new qlcConector(new URL("ws://127.0.0.1:2480/qlcplusWS"));
qlc.connect();
