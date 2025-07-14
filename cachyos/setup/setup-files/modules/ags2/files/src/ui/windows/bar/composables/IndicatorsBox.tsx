import { createBinding, createComputed, With } from "ags";
import AstalPowerProfiles from "gi://AstalPowerProfiles";
import AstalWp from "gi://AstalWp?version=0.1";
import icons from "../../../../icons";

const powerprofiles = AstalPowerProfiles.get_default();
const wp = AstalWp.get_default();

export default function () {
   // powerprofiles indicator state
   const activeProfileBinding = createBinding(powerprofiles, "activeProfile");

   // microphone indicator state
   if (wp === null) {
      return;
   }

   const audio = wp.get_audio();

   if (audio === null) {
      return;
   }

   const microphone = audio.get_default_microphone();

   if (microphone === null) {
      return;
   }

   const audioRecordersBinding = createBinding(audio, "recorders");
   const volumeBinding = createBinding(microphone, "volume");

   // screen recorder indicator state
   const video = wp.get_video();

   if (video === null) {
      return;
   }

   const videoRecordersBinding = createBinding(video, "recorders");

   return (
      <box cssClasses={["indicators-box"]}>
         <With value={activeProfileBinding}>
            {(activeProfile) => {
               let iconName = "image-missing";

               if (activeProfile === "powersaving") {
                  iconName = icons.powerprofile.powerSaver;
               } else if (activeProfile === "balanced") {
                  iconName = icons.powerprofile.balanced;
               } else if (activeProfile === "performance") {
                  iconName = icons.powerprofile.performance;
               }

               return <image iconName={iconName} />;
            }}
         </With>

         <With value={audioRecordersBinding}>
            {(value) => {
               if (value.length <= 0) {
                  return;
               }

               return (
                  <image
                     iconName={createComputed([volumeBinding], (volume) => {
                        if (volume > 0.67) {
                           return icons.audio.mic.high;
                        } else if (volume > 0.34) {
                           return icons.audio.mic.medium;
                        } else if (volume > 0.1) {
                           return icons.audio.mic.low;
                        } else {
                           return icons.audio.mic.muted;
                        }
                     })}
                  />
               );
            }}
         </With>

         <With value={videoRecordersBinding}>
            {(videoRecorders) => {
               if (videoRecorders.length <= 0) {
                  return;
               }

               return <image iconName={icons.recorder.screencast} />;
            }}
         </With>
      </box>
   );
}
