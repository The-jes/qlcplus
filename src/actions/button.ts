import streamDeck, {
  action,
  KeyDownEvent,
  SingletonAction,
  KeyUpEvent,
} from "@elgato/streamdeck";
import { qlc } from "../plugin";

/**
 * An example action class that displays a url that increments by one each time the button is pressed.
 */
@action({ UUID: "de.jesko-stolp.qlcplusonsd.button" })
export class button extends SingletonAction<buttonSettings> {
  override onKeyDown(ev: KeyDownEvent<buttonSettings>): void {
    const { settings } = ev.payload;

    let { url, id } = settings;
    const body = id + "|255";
    //sendData(url, body);
    if (qlc.send(body)) {
      ev.action.showOk();
    } else ev.action.showAlert();

    //wsClient.send("45|255");
  }
  override onKeyUp(ev: KeyUpEvent<buttonSettings>): void {
    const { settings } = ev.payload;
    let { url, id } = settings;
    const body = id + "|0";
    qlc.send(body);
  }
  /*
  override onWillAppear(
    ev: WillAppearEvent<buttonSettings>
  ): Promise<void> | void {
    qlc.on("qlcmessage", (msg: any) => {
      //JSON.stringify(ev.payload.settings.id)
      const msgArr: string[] = msg.split("|");
      if (msgArr[0] != String(ev.payload.settings.id)) {
        return;
      }
      //Display the current state
      //streamDeck.logger.debug(msgArr.at(-1));
    });
  }*/
}

/**
 * Settings for {@link Incrementurler}.
 */
type buttonSettings = {
  url: string;
  id: number;
};
