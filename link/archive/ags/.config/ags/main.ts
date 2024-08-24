import Bar from "widgets/bar/Bar";
import NotificationPopup from "widgets/notifications/NotificationPopup";
import Overview from "widgets/overview/Overview";

const bar = Bar(0);
const notificationPopup = NotificationPopup(0);
const overview = Overview(0);

App.config({
   style: "/home/bluewy/.config/ags/style.css",
   //iconTheme: "Sweet-Rainbow",
   windows: [bar, notificationPopup, overview],
});
