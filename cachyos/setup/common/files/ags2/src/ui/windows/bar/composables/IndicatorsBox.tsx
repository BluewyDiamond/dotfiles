import { createBinding, createComputed, createExternal, With } from "ags";
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

   const defaultMicrophoneExternal = createExternal<null | AstalWp.Endpoint>(
      null,
      (set) => {
         const onMicrophonesChanged = () => {
            const microphones = audio.get_microphones();
            if (microphones === null) return;

            const foundMicrophone = microphones.find(
               (microphone) => microphone.isDefault
            );

            if (foundMicrophone === undefined) {
               return;
            }

            set(foundMicrophone);
         };

         const microphonesConnectionId = audio.connect(
            "notify::microphones",
            (_) => {
               onMicrophonesChanged();
            }
         );

         onMicrophonesChanged();

         return () => audio.disconnect(microphonesConnectionId);
      }
   );

   const audioRecordersBinding = createBinding(audio, "recorders");

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

         <With value={defaultMicrophoneExternal}>
            {(defaultMicrophone) => {
               if (defaultMicrophone === null) return;
               const volumeBinding = createBinding(defaultMicrophone, "volume");

               const iconName = createComputed([volumeBinding], (volume) => {
                  if (volume > 0.67) {
                     return options.bar.indicators.microphoneRecorders.icons
                        .microphoneHigh;
                  } else if (volume > 0.34) {
                     return options.bar.indicators.microphoneRecorders.icons
                        .microphoneMedium;
                  } else if (volume > 0.1) {
                     return options.bar.indicators.microphoneRecorders.icons
                        .microphoneLow;
                  } else {
                     return options.bar.indicators.microphoneRecorders.icons
                        .microphoneMuted;
                  }
               });

               return <image iconName={iconName} />;
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
