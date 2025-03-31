import { Widget, Gtk } from "astal/gtk4";
import { bind } from "astal/binding";
import { Variable } from "astal";
import PowerProfiles from "gi://AstalPowerProfiles";
import icons, { Icon } from "../../../../../libs/icons";
import Wp from "gi://AstalWp";
import { IconWithLabelFallback } from "../../../../composables/IconWithLabelFallback";
import options from "../../../../../options";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import Trackable from "../../../../../libs/Trackable";
import { EfficientRenderingMap } from "../../../../../libs/efficientRendering";

const powerProfiles =
   PowerProfiles.get_default() as AstalPowerProfiles.PowerProfiles | null;

const wp = Wp.get_default();
const audio = wp?.get_audio();
const microphone = audio?.get_default_microphone();
const speaker = audio?.get_default_speaker();
const video = wp?.get_video();

enum Indicators {
   PowerProfiles,
   MicrophoneRecorders,
   ScreenRecorders,
   Speaker,
}

export class IndicatorsEfficientRenderingMap extends EfficientRenderingMap<
   Indicators,
   Gtk.Widget | null,
   Gtk.Widget
> {
   private readonly trackable = new Trackable();

   constructor() {
      super();

      this.setupPowerProfilesIndicator();
      this.setupScreenRecordersIndicator();
      this.setupMicrophoneRecordersIndicator();
      this.setupSpeakerIndicator();
   }

   destroy(): void {
      super.destroy();
      this.trackable.destroy();
   }

   protected notify(): void {
      const array = [];

      for (const widget of this.map.values()) {
         if (widget === null) {
            continue;
         }

         array.push(widget);
      }

      this.variable.set(array);
   }

   private setupPowerProfilesIndicator(): void {
      if (powerProfiles === null) {
         this.map.set(
            Indicators.PowerProfiles,

            Widget.Label({
               label: `${Indicators.PowerProfiles.toString().toLowerCase()}!`,
            })
         );

         return;
      }

      const onPowerProfileChanged = (): void => {
         const activeProfile = powerProfiles.get_active_profile();

         if (activeProfile === "balanced") {
            this.map.set(Indicators.PowerProfiles, null);
            this.notify();
         } else if (activeProfile === "powersaver") {
            this.map.set(
               Indicators.PowerProfiles,

               IconWithLabelFallback({
                  icon: icons.powerprofile.powerSaver,
                  symbolic: options.bar.indicators.powerprofiles.monochrome,
               })
            );

            this.notify();
         } else if (activeProfile === "performance") {
            this.map.set(
               Indicators.PowerProfiles,

               IconWithLabelFallback({
                  icon: icons.powerprofile.performance,
                  symbolic: options.bar.indicators.powerprofiles.monochrome,
               })
            );

            this.notify();
         } else {
            this.map.set(
               Indicators.PowerProfiles,

               Widget.Label({ label: "?" })
            );

            this.notify();
         }
      };

      onPowerProfileChanged();

      this.trackable.track([
         powerProfiles.connect("notify", () => {
            onPowerProfileChanged();
         }),

         powerProfiles,
      ]);
   }

   private setupMicrophoneRecordersIndicator(): void {
      if (audio == null) {
         this.map.set(
            Indicators.MicrophoneRecorders,

            Widget.Label({
               label: `${Indicators.MicrophoneRecorders.toString().toLowerCase()}!`,
            })
         );

         this.notify();
         return;
      }

      if (microphone === null || microphone === undefined) {
         this.map.set(
            Indicators.MicrophoneRecorders,

            Widget.Label({
               label: `${Indicators.MicrophoneRecorders.toString().toLowerCase()}!`,
            })
         );

         this.notify();
         return;
      }

      this.trackable.track(
         Variable.derive(
            [bind(audio, "recorders"), bind(microphone, "volume")],

            (recorders, micVolume) => {
               if (recorders.length > 0) {
                  const {
                     audio: {
                        mic: { high, medium, low, muted },
                     },
                  } = icons;

                  let icon: Icon | null = null;

                  if (micVolume > 0.67) {
                     icon = high;
                  } else if (micVolume > 0.34) {
                     icon = medium;
                  } else if (micVolume > 0.1) {
                     icon = low;
                  } else {
                     icon = muted;
                  }

                  this.map.set(
                     Indicators.MicrophoneRecorders,
                     IconWithLabelFallback({ icon })
                  );
                  this.notify();
               } else {
                  this.map.set(Indicators.MicrophoneRecorders, null);
                  this.notify();
               }
            }
         )
      );
   }

   private setupSpeakerIndicator(): void {
      if (audio == null) {
         this.map.set(
            Indicators.Speaker,

            Widget.Label({
               label: `${Indicators.Speaker.toString().toLowerCase()}!`,
            })
         );

         this.notify();
         return;
      }

      if (speaker === null || speaker === undefined) {
         this.map.set(
            Indicators.Speaker,

            Widget.Label({
               label: `${Indicators.Speaker.toString().toLowerCase()}!`,
            })
         );

         this.notify();
         return;
      }

      this.trackable.track(
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

            this.map.set(Indicators.Speaker, IconWithLabelFallback({ icon }));
            this.notify();
         })
      );
   }

   private setupScreenRecordersIndicator(): void {
      if (video == null) {
         this.map.set(
            Indicators.ScreenRecorders,
            Widget.Label({ label: `${Indicators.ScreenRecorders}!` })
         );

         this.notify();
         return;
      }

      this.trackable.track(
         Variable.derive(
            [bind(video, "recorders")],

            (recorders: Wp.Endpoint[]) => {
               if (recorders.length > 0) {
                  this.map.set(
                     Indicators.ScreenRecorders,

                     IconWithLabelFallback({
                        icon: icons.recorder.screencast,
                     })
                  );

                  this.notify();
               } else {
                  this.map.set(Indicators.ScreenRecorders, null);
                  this.notify();
               }
            }
         )
      );
   }
}
