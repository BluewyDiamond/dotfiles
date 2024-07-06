import Bar from "widgets/bar/Bar";
import NotificationPopup from "widgets/notifications/NotificationPopup";

App.config({
   style: "/home/bluewy/.config/ags/style.css",
   //iconTheme: "Sweet-Rainbow",
   windows: [Bar(0), NotificationPopup(0)],
});
