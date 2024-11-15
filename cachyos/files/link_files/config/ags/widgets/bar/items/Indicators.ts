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
   const wp = Wp.get_default()!;
   const audio = wp.audio;

   return new Widget.Box({
      children: [],

      setup: (self) => {
         // this does not work, idk what is the proper equivalent
         self.hook(Wp.get_default()?.audio!, "", () => {
            let curatedIcon = "";

            if (
               audio.recorders.length > 0 ||
               audio.default_microphone.get_mute() ||
               false
            ) {
               if (audio.default_microphone.get_volume() > 50) {
                  curatedIcon = curateIcon(icons.audio.mic.high);
               } else if (audio.default_microphone.get_volume() > 25) {
                  curatedIcon = curateIcon(icons.audio.mic.medium);
               } else if (audio.default_microphone.get_volume() > 0) {
                  curatedIcon = curateIcon(icons.audio.mic.low);
               } else {
                  curatedIcon = curateIcon(icons.audio.mic.muted);
               }
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
                     label: "mic",
                  }),
               ];
            }
         });
      },
   });
}
