import { astalify, Gtk, Widget } from "astal/gtk3";
import icons from "../../../libs/icons";
import Wp from "gi://AstalWp";
import { bind, Variable } from "astal";
import { curateIcon } from "../../../libs/utils";

export default function (): Widget.Button {
   return new Widget.Button({
      child: new Widget.Box({
         children: [MicIndicator()],
      }),
   });
}

function MicIndicator(): Widget.Box {
   return new Widget.Box({
      children: [],

      setup: (self) => {
         const audio = Wp.get_default()?.get_audio()!;
         const micDefault = audio.get_default_microphone()!;

         let curatedIcon = Variable("");
         let curatedLabel = Variable("");
         let visible = Variable(false);

         function updateVolume() {
            if (micDefault.volume >= 0.5) {
               curatedIcon.set(curateIcon(icons.audio.mic.high));
               curatedLabel.set("mic high");
            } else if (micDefault.volume >= 0.25) {
               curatedIcon.set(curateIcon(icons.audio.mic.medium));
               curatedLabel.set("mic mid");
            } else if (micDefault.volume > 0) {
               curatedIcon.set(curateIcon(icons.audio.mic.low));
               curatedLabel.set("mic low");
            } else {
               curatedIcon.set(curateIcon(icons.audio.mic.muted));
               curatedLabel.set("mic muted");
            }
         }

         // setup initiallly
         updateVolume();

         micDefault.connect("notify::volume", () => {
            updateVolume();
         });

         function updateRecorders() {
            const recorders = audio.get_recorders()!;
            print(`recorders: ${recorders.length}`);

            if (recorders.length > 0 || micDefault.get_mute() || false) {
               visible.set(true);
            } else {
               visible.set(false);
            }
         }

         // setup initially
         updateRecorders();

         audio.connect("notify::recorders", () => {
            updateRecorders();
         });

         self.children = [
            new Widget.Icon({
               icon: bind(curatedIcon).as((cI) => cI),

               visible: bind(visible).as((v) => {
                  if (v && curatedIcon.get()) {
                     return true;
                  }
               }),
            }),

            new Widget.Label({
               label: bind(curatedLabel).as((cL) => cL),

               visible: bind(visible).as((v) => {
                  if (v && !curatedIcon.get()) {
                     return true;
                  }
               }),
            }),
         ];
      },
   });
}
