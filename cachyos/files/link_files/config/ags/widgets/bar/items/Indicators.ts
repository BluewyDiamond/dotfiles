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

         self.hook(audio, "notify::recorders", () => {
            print("in");

            const micDefault = audio.get_default_microphone()!;

            if (!micDefault) {
               return;
            }

            function logic() {
               const recorders = audio.get_recorders();

               if (!recorders) {
                  return;
               }

               let curatedIcon = "";
               let curatedLabel = "";

               if (recorders.length > 0 || micDefault.get_mute() || false) {
                  if (micDefault.volume >= 0.5) {
                     curatedIcon = curateIcon(icons.audio.mic.high);
                     curatedLabel = "mic high";
                  } else if (micDefault.volume >= 0.25) {
                     curatedIcon = curateIcon(icons.audio.mic.medium);
                     curatedLabel = "mic mid";
                  } else if (micDefault.volume > 0) {
                     curatedIcon = curateIcon(icons.audio.mic.low);
                     curatedLabel = "mic low";
                  } else {
                     curatedIcon = curateIcon(icons.audio.mic.muted);
                     curatedLabel = "mic muted";
                  }

                  if (curatedIcon) {
                     self.children = [
                        new Widget.Icon({
                           icon: curatedIcon,
                        }),
                     ];
                  } else {
                     self.children = [
                        new Widget.Label({
                           label: curatedLabel,
                        }),
                     ];
                  }
               } else {
                  self.children = [];
               }
            }

            logic();

            micDefault.connect("notify::volume", () => {
               logic();
            });
         });
      },
   });
}
