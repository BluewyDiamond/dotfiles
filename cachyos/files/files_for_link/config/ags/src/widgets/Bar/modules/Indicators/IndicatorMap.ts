import { Gtk, Widget } from "astal/gtk3";
import { bind, Subscribable } from "astal/binding";
import { timeout, Variable } from "astal";
import PowerProfiles from "gi://AstalPowerProfiles";
import icons from "../../../../libs/icons";
import { findIcon } from "../../../../utils";
import Wp from "gi://AstalWp";
import { IconWithLabelFallback } from "../../../wrappers/IconWithLabelFallback";

export class IndicatorMap implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      {
         const powerProfiles = PowerProfiles.get_default();

         const onPowerProfileChanged = () => {
            const activeProfile = powerProfiles.get_active_profile();
            const { balanced, powerSaver, performance } = icons.powerprofile;

            const powerProfileStates = [
               ["balanced", balanced],
               ["powersaver", powerSaver],
               ["performance", performance],
            ] as const;

            const icon =
               powerProfileStates.find(
                  ([state]) => state === activeProfile
               )?.[1] || "";

            let foundedIcon = findIcon(icon);

            this.set(
               "powerprofiles",
               IconWithLabelFallback({ icon: foundedIcon })
            );
         };

         onPowerProfileChanged();
         powerProfiles.connect("notify", () => onPowerProfileChanged());
      }

      {
         const audio = Wp.get_default()?.get_audio();

         if (!audio) {
            return;
         }

         const mic = audio.get_default_microphone();

         if (!mic) {
            return;
         }

         Variable.derive(
            [bind(audio, "recorders"), bind(mic, "volume")],

            (recorders, micVolume) => {
               if (recorders.length > 0) {
                  if (!mic) {
                     return;
                  }

                  let icon = "";

                  if (micVolume > 0.67) {
                     icon = icons.audio.mic.high;
                  } else if (micVolume > 0.34) {
                     icon = icons.audio.mic.medium;
                  } else if (micVolume > 0.1) {
                     icon = icons.audio.mic.low;
                  } else {
                     icon = icons.audio.mic.muted;
                  }

                  this.set(
                     "recorders",
                     IconWithLabelFallback({ icon: findIcon(icon) })
                  );
               } else {
                  this.delete("recorders");
               }
            }
         );
      }

      {
         const audio = Wp.get_default()?.get_audio();
         if (!audio) return;
         const speaker = audio.get_default_speaker();
         if (!speaker) return;

         Variable.derive([bind(speaker, "volume")], (volume) => {
            let icon = "";

            if (volume > 0.67) {
               icon = icons.audio.volume.high;
            } else if (volume > 0.34) {
               icon = icons.audio.volume.medium;
            } else if (volume > 0.1) {
               icon = icons.audio.volume.low;
            } else {
               icon = icons.audio.volume.muted;
            }

            this.set(
               "speaker",
               IconWithLabelFallback({ icon: findIcon(icon) })
            );
         });
      }

      {
         const video = Wp.get_default()?.get_video();
         if (!video) return;

         Variable.derive(
            [bind(video, "recorders")],

            (recorders: Wp.Endpoint[]) => {
               if (recorders.length > 0) {
                  this.set(
                     "screen-recorders",

                     IconWithLabelFallback({
                        icon: findIcon(icons.recorder.screencast),
                     })
                  );
               } else {
                  this.delete("screen-recorders");
               }
            }
         );
      }
   }

   get() {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void) {
      return this.var.subscribe(callback);
   }

   private notify() {
      this.var.set([...this.map.values()].reverse());
   }

   private set(key: string, value: Gtk.Widget) {
      this.map.get(key)?.destroy();
      this.map.set(key, value);
      this.notify();
   }

   private delete(key: string) {
      this.map.get(key)?.destroy();
      this.map.delete(key);
      this.notify();
   }
}
