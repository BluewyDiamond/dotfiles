import type { Gtk } from "astal/gtk4";
import { bind, type Subscribable } from "astal/binding";
import { Variable } from "astal";
import PowerProfiles from "gi://AstalPowerProfiles";
import icons, { Icon } from "../../../../libs/icons";
import Wp from "gi://AstalWp";
import { IconWithLabelFallback } from "../../../composables/IconWithLabelFallback";
import Hookable from "../../../../libs/services/Hookable";
import options from "../../../../options";

const powerProfiles = PowerProfiles.get_default();
const wp = Wp.get_default();

export class IndicatorMap extends Hookable implements Subscribable {
   private readonly map: Map<string, Gtk.Widget | null> = new Map<
      string,
      Gtk.Widget | null
   >();

   private readonly var: Variable<Gtk.Widget[]> = Variable([]);

   constructor() {
      super();

      {
         const onPowerProfileChanged = (): void => {
            const activeProfile = powerProfiles.get_active_profile();

            if (activeProfile === "balanced") {
               this.map.set("powerprofiles", null);
               this.notify();
            } else if (activeProfile === "powersaver") {
               this.map.set(
                  "powerprofiles",
                  IconWithLabelFallback({
                     icon: icons.powerprofile.powerSaver,
                     symbolic: options.bar.indicators.powerprofiles.symbolic,
                  })
               );

               this.notify();
            } else if (activeProfile === "performance") {
               this.map.set(
                  "powerprofiles",
                  IconWithLabelFallback({
                     icon: icons.powerprofile.performance,
                     symbolic: options.bar.indicators.powerprofiles.symbolic,
                  })
               );

               this.notify();
            } else {
               this.map.set(
                  "powerprofiles",
                  IconWithLabelFallback({ icon: icons.broken })
               );

               this.notify();
            }
         };

         onPowerProfileChanged();

         this.hook(powerProfiles, "notify", () => {
            onPowerProfileChanged();
         });
      }

      {
         const audio = wp?.get_audio();

         if (audio == null) {
            this.map.set(
               "recoders",
               IconWithLabelFallback({ icon: icons.broken })
            );

            this.notify();
            return;
         }

         const mic = audio.get_default_microphone();

         if (mic === null) {
            this.map.set(
               "recoders",
               IconWithLabelFallback({ icon: icons.broken })
            );

            this.notify();
            return;
         }

         this.derives.add(
            Variable.derive(
               [bind(audio, "recorders"), bind(mic, "volume")],

               (recorders, micVolume) => {
                  if (recorders.length > 0) {
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

                     this.map.set("recorders", IconWithLabelFallback({ icon }));
                     this.notify();
                  } else {
                     this.map.set("recorders", null);
                     this.notify();
                  }
               }
            )
         );
      }

      {
         const audio = wp?.get_audio();

         if (audio == null) {
            this.map.set(
               "recoders",
               IconWithLabelFallback({ icon: icons.broken })
            );

            this.notify();
            return;
         }

         const speaker = audio.get_default_speaker();

         if (speaker === null) {
            this.map.set(
               "recoders",
               IconWithLabelFallback({ icon: icons.broken })
            );

            this.notify();
            return;
         }

         this.derives.add(
            Variable.derive([bind(speaker, "volume")], (volume) => {
               let icon: Icon | null = null;

               const {
                  audio: {
                     volume: { high, medium, low, muted },
                  },
               } = icons;

               if (volume > 0.67) {
                  icon = high;
               } else if (volume > 0.34) {
                  icon = medium;
               } else if (volume > 0.1) {
                  icon = low;
               } else {
                  icon = muted;
               }

               this.map.set("speaker", IconWithLabelFallback({ icon }));
               this.notify();
            })
         );
      }

      {
         const video = wp?.get_video();

         if (video == null) {
            this.map.set(
               "recoders",
               IconWithLabelFallback({ icon: icons.broken })
            );

            this.notify();
            return;
         }

         this.derives.add(
            Variable.derive(
               [bind(video, "recorders")],

               (recorders: Wp.Endpoint[]) => {
                  if (recorders.length > 0) {
                     this.map.set(
                        "screen-recorders",

                        IconWithLabelFallback({
                           icon: icons.recorder.screencast,
                        })
                     );

                     this.notify();
                  } else {
                     this.map.set("screen-recorders", null);
                     this.notify();
                  }
               }
            )
         );
      }
   }

   get(): Gtk.Widget[] {
      return this.var.get();
   }

   subscribe(callback: (list: Gtk.Widget[]) => void): () => void {
      return this.var.subscribe(callback);
   }

   destroy(): void {
      super.destroy();
      this.var.drop();
   }

   private notify(): void {
      const array = [];

      for (const widget of this.map.values()) {
         if (widget === null) {
            continue;
         }

         array.push(widget);
      }

      this.var.set(array);
   }
}
