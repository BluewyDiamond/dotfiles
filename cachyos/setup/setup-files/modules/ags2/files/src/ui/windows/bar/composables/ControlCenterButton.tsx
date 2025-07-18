import app from "ags/gtk4/app";

export default function () {
   return (
      <button
         cssClasses={["control-center-button"]}
         onClicked={() => app.toggle_window("ags_control_center")}
      >
         <label label="+++" />
      </button>
   );
}
