import { astalify, Gtk, Widget } from "astal/gtk3";
import MicIndicator from "./MicIndicator";
import MicIndicator2 from "./MicIndicator2";
import SpeakerIndicator from "./SpeakerIndicator";
import ScreenShareIndicater from "./ScreenShareIndicater";
import PowerProfileIndicator from "./PowerProfileIndicator";
import options from "../../../libs/options";

export default function (): Widget.Button {
   return new Widget.Button({
      className: "indicators",

      child: new Widget.Box({
         spacing: options.bar.indicators.spacing,

         children: [
            SpeakerIndicator(),
            MicIndicator2(),
            ScreenShareIndicater(),
            PowerProfileIndicator(),
         ],
      }),
   });
}
