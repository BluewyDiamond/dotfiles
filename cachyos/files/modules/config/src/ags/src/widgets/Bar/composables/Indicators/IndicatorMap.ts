import { Gtk } from "astal/gtk4";
import { bind, Subscribable } from "astal/binding";
import { Variable } from "astal";
import PowerProfiles from "gi://AstalPowerProfiles";
import icons from "../../../../libs/icons";
import Wp from "gi://AstalWp";
import { IconWithLabelFallback } from "../../../composables/IconWithLabelFallback";
import Hookable from "../../../../libs/services/Hookable";
import options from "../../../../options";

const powerProfiles = PowerProfiles.get_default();
const wp = Wp.get_default();

export class IndicatorMap extends Hookable implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);
   // store references to be able to destroy them later
   private derives: Set<Variable<any>> = new Set();

   constructor() {
      super();

      {
         const onPowerProfileChanged = () => {
            const activeProfile = powerProfiles.get_active_profile();

            if (activeProfile === "balanced") {
               this.delete("powerprofiles");
            } else if (activeProfile === "powersaver") {
               this.set(
                  "powerprofiles",
                  IconWithLabelFallback({
                     icon: icons.powerprofile.powerSaver,
                     symbolic: options.bar.indicators.powerprofiles.symbolic,
                  })
               );
            } else if (activeProfile === "performance") {
               this.set(
                  "powerprofiles",
                  IconWithLabelFallback({
                     icon: icons.powerprofile.performance,
                     symbolic: options.bar.indicators.powerprofiles.symbolic,
                  })
               );
            } else {
               this.set(
                  "powerprofiles",
                  IconWithLabelFallback({ icon: icons.broken })
               );
            }
         };

         onPowerProfileChanged();
         this.hook(powerProfiles, "notify", () => onPowerProfileChanged());
      }

      {
         const audio = wp?.get_audio();

         if (!audio) {
            this.set("recoders", IconWithLabelFallback({ icon: icons.broken }));

            return;
         }

         const mic = audio.get_default_microphone();

         if (!mic) {
            this.set("recoders", IconWithLabelFallback({ icon: icons.broken }));

            return;
         }

         this.derives.add(
            Variable.derive(
               [bind(audio, "recorders"), bind(mic, "volume")],

               (recorders, micVolume) => {
                  if (recorders.length > 0) {
                     if (!mic) {
                        this.set(
                           "recoders",
                           IconWithLabelFallback({ icon: icons.broken })
                        );

                        return;
                     }

                     let icon;

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
                        IconWithLabelFallback({ icon: icon })
                     );
                  } else {
                     this.delete("recorders");
                  }
               }
            )
         );
      }

      {
         const audio = wp?.get_audio();

         if (!audio) {
            this.set("recoders", IconWithLabelFallback({ icon: icons.broken }));

            return;
         }

         const speaker = audio.get_default_speaker();

         if (!speaker) {
            this.set("recoders", IconWithLabelFallback({ icon: icons.broken }));

            return;
         }

         this.derives.add(
            Variable.derive([bind(speaker, "volume")], (volume) => {
               let icon;

               if (volume > 0.67) {
                  icon = icons.audio.volume.high;
               } else if (volume > 0.34) {
                  icon = icons.audio.volume.medium;
               } else if (volume > 0.1) {
                  icon = icons.audio.volume.low;
               } else {
                  icon = icons.audio.volume.muted;
               }

               this.set("speaker", IconWithLabelFallback({ icon: icon }));
            })
         );
      }

      {
         const video = wp?.get_video();

         if (!video) {
            this.set("recoders", IconWithLabelFallback({ icon: icons.broken }));

            return;
         }

         this.derives.add(
            Variable.derive(
               [bind(video, "recorders")],

               (recorders: Wp.Endpoint[]) => {
                  if (recorders.length > 0) {
                     this.set(
                        "screen-recorders",

                        IconWithLabelFallback({
                           icon: icons.recorder.screencast,
                        })
                     );
                  } else {
                     this.delete("screen-recorders");
                  }
               }
            )
         );
      }
   }

   get() {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void) {
      return this.var.subscribe(callback);
   }

   destroy() {
      super.destroy();
      this.var.drop();
      this.derives.forEach((derivedVar) => derivedVar.drop());
   }

   private set(key: string, value: Gtk.Widget) {
      //this.map.get(key)?.destroy();
      this.map.set(key, value);
      this.notify();
   }

   private delete(key: string) {
      //this.map.get(key)?.destroy();
      this.map.delete(key);
      this.notify();
   }

   private notify() {
      this.var.set([...this.map.values()].reverse());
   }
}
