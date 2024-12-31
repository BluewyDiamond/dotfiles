import { Widget } from "astal/gtk3";
import MicIndicator2 from "./MicIndicator2";
import SpeakerIndicator from "./SpeakerIndicator";
import ScreenShareIndicater from "./ScreenShareIndicator";
import PowerProfileIndicator from "./PowerProfileIndicator";

export default function (): Widget.Button {
   return new Widget.Button({
      className: "indicators",

      child: new Widget.Box({
         children: [
            SpeakerIndicator(),
            MicIndicator2(),
            ScreenShareIndicater(),
            PowerProfileIndicator(),
         ],
      }),
   });
}
