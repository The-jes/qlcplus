import streamDeck, {
  action,
  SingletonAction,
  WillAppearEvent,
  DialRotateEvent,
  DialDownEvent,
} from "@elgato/streamdeck";
import { qlc } from "../plugin";

/**
 * An example action class that displays a url that increments by one each time the button is pressed.
 */
@action({ UUID: "de.jesko-stolp.qlcplusonsd.fader" })
export class fader extends SingletonAction<dialSettings> {
  private setValue(
    ev: DialRotateEvent | DialDownEvent | WillAppearEvent,
    value: number
  ): void {
    // Save the new value to settings
    const settings = ev.payload.settings;
    settings.value = value;
    ev.action.setSettings(settings);

    //Set Feedback
    if (ev.action.isDial()) {
      ev.action.setFeedback({
        indicator: {
          value: Math.floor((value / 255) * 100),
        },
        value: value,
      });
    }

    //Send Data

    const msg = settings.id + "|" + settings.value;
    qlc.send(msg);
  }
  override onDialDown(ev: DialDownEvent<dialSettings>): Promise<void> | void {
    const settings = ev.payload.settings;
    let value: number;

    if (settings.value == 0) {
      value = 255;
    } else value = 0;
    //send the data to QLC+
    this.setValue(ev, value);
  }
  override onDialRotate(
    ev: DialRotateEvent<dialSettings>
  ): Promise<void> | void {
    const settings = ev.payload.settings;

    // Retrieve current settings for this action
    let value = settings.value !== undefined ? settings.value : 0; //Set default to 0 if no other value is set

    // Adjust value based on encoder rotation
    value = Math.min(255, Math.max(0, ev.payload.ticks * 2 + value));

    //Set Feedback
    this.setValue(ev, value);
  }
  override onWillAppear(
    ev: WillAppearEvent<dialSettings>
  ): Promise<void> | void {
    this.setValue(ev, ev.payload.settings.value);

    qlc.on("qlcmessage", (msg: any) => {
      const msgArr: string[] = msg.split("|");
      if (Number(msgArr[0]) != Number(ev.payload.settings.id)) {
        return;
      }

      streamDeck.logger.info(msg);
      //Display the current state

      this.setValue(ev, Number(msgArr.at(-1)));
    });
  }
}

/**
 * Settings for {@link fader}.
 */
type dialSettings = {
  url: string;
  id: number;
  value: number;
};
