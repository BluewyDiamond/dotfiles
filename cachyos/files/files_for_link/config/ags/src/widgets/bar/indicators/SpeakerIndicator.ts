import { Widget } from "astal/gtk3";
import Wp from "gi://AstalWp";
import icons from "../../../libs/icons";
import { curateIcon} from "../../../utils";

const errorTitle = "SpeakerIndicator";

export default function (): Widget.Box {
   const audio = Wp.get_default()?.get_audio();

   if (!audio) {

      return new Widget.Box({
         children: [new Widget.Label({ label: "󱪗" })],
      });
   }

   const speaker = audio.get_default_speaker();

   if (!speaker) {

      return new Widget.Box({
         children: [new Widget.Label({ label: "󱪗" })],
      });
   }

   return new Widget.Box({
      setup: (self) => {
         // init
         onSpeakerVolumeChange(speaker);

         self.hook(speaker, "notify::volume", () => {
            onSpeakerVolumeChange(speaker);
         });

         function onSpeakerVolumeChange(speaker: Wp.Endpoint) {
            const speakerVolume = speaker.get_volume();
            const { muted, low, medium, high, overamplified } =
               icons.audio.volume;

            const iconStates = [
               [101, overamplified],
               [67, high],
               [34, medium],
               [1, low],
               [0, muted],
            ] as const;

            const icon =
               iconStates.find(
                  ([state]) => state <= speakerVolume * 100
               )?.[1] || "";

            const curatedIcon = curateIcon(icon);

            if (curatedIcon === "") {
               self.children = [new Widget.Label({ label: "?" })];
            } else {
               self.children = [new Widget.Icon({ icon: curatedIcon })];
            }

            self.visible = true;
         }
      },
   });
}
