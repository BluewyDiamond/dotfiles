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

         const curatedIcon = Variable("");
         const curatedLabel = Variable("");
         const show = Variable(false);

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
            const isMuted = micDefault.get_mute();

            print("TODO: fix isMuted is true despite false");
            print(`isMuted: ${isMuted}`);

            if (recorders.length > 0) {
               show.set(true);
            } else {
               show.set(false);
            }
         }

         // setup initially
         updateRecorders();

         audio.connect("notify::recorders", () => {
            updateRecorders();
         });

         Variable.derive([curatedIcon, show], (cI, s) => {
            if (s === true) {
               if (cI !== "") {
                  self.children = [
                     new Widget.Icon({ icon: bind(curatedIcon) }),
                  ];
               } else {
                  self.children = [
                     new Widget.Label({ label: bind(curatedLabel) }),
                  ];
               }
            } else {
               self.children = [];
            }
         });
      },
   });
}
