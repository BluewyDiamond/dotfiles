import { createBinding, createComputed, With } from "ags";
import AstalPowerProfiles from "gi://AstalPowerProfiles";
import AstalWp from "gi://AstalWp";
import options from "../../../../options";
import AstalNotifd from "gi://AstalNotifd";

const powerprofiles = AstalPowerProfiles.get_default();
const wp = AstalWp.get_default();
const notifd = AstalNotifd.get_default();

export default function () {
   // powerprofile indicator state
   const activeProfileBinding = createBinding(powerprofiles, "activeProfile");

   // microphone recorders indicator state
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

   // speaker indicator state
   const speaker = wp.get_default_speaker();

   if (speaker === null) {
      return;
   }

   const speakerVolumeBinding = createBinding(speaker, "volume");
   const notificationsBinding = createBinding(notifd, "notifications");

   return (
      <box cssClasses={["indicators-box"]}>
         <With value={activeProfileBinding}>
            {(activeProfile) => {
               let iconName = "image-missing";

               if (activeProfile === "powersaving") {
                  iconName =
                     options.bar.indicators.powerprofile.icons.powerSaver;
               } else if (activeProfile === "balanced") {
                  iconName = options.bar.indicators.powerprofile.icons.balanced;
               } else if (activeProfile === "performance") {
                  iconName =
                     options.bar.indicators.powerprofile.icons.performance;
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
                           return options.bar.indicators.microphoneRecorders
                              .icons.microphoneHigh;
                        } else if (volume > 0.34) {
                           return options.bar.indicators.microphoneRecorders
                              .icons.microphoneMedium;
                        } else if (volume > 0.1) {
                           return options.bar.indicators.microphoneRecorders
                              .icons.microphoneLow;
                        } else {
                           return options.bar.indicators.microphoneRecorders
                              .icons.microphoneMuted;
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

               return (
                  <image iconName={options.bar.indicators.icons.screenshare} />
               );
            }}
         </With>

         <With value={speakerVolumeBinding}>
            {(speakerVolume) => {
               let iconName = "";

               if (speakerVolume <= 0) {
                  iconName = options.bar.indicators.speaker.icons.speakerMuted;
               } else if (speakerVolume <= 0.34) {
                  iconName = options.bar.indicators.speaker.icons.speakerLow;
               } else if (speakerVolume <= 0.67) {
                  iconName = options.bar.indicators.speaker.icons.speakerMedium;
               } else if (speakerVolume <= 1) {
                  iconName = options.bar.indicators.speaker.icons.speakerHigh;
               } else {
                  iconName =
                     options.bar.indicators.speaker.icons.speakerOveramplified;
               }

               return <image iconName={iconName} />;
            }}
         </With>

         <With value={notificationsBinding}>
            {(notifications) => {
               if (notifications.length > 0) {
                  return (
                     <image
                        iconName={
                           options.bar.indicators.notifications.icons
                              .notificationNoisy
                        }
                     />
                  );
               }
            }}
         </With>
      </box>
   );
}
