import { astalify, Gtk, Widget } from "astal/gtk3";
import MicIndicator from "./MicIndicator";
import MicIndicator2 from "./MicIndicator2";

export default function (): Widget.Button {
   return new Widget.Button({
      child: new Widget.Box({
         children: [MicIndicator2()],
      }),
   });
}

