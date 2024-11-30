import { astalify, Gtk, Widget } from "astal/gtk3";
import MicIndicator from "./MicIndicator";
import MicIndicator2 from "./MicIndicator2";
import SpeakerIndicator from "./SpeakerIndicator";
import ScreenShareIndicater from "./ScreenShareIndicater";
import PowerProfileIndicator from "./PowerProfileIndicator";

export default function (): Widget.Button {
   return new Widget.Button({
      child: new Widget.Box({
         children: [SpeakerIndicator(), MicIndicator2(), ScreenShareIndicater(), PowerProfileIndicator()],
      }),
   });
}

