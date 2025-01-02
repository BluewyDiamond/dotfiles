import { Gtk, Widget } from "astal/gtk3";
import { bind, Subscribable } from "astal/binding";
import { timeout, Variable } from "astal";
import PowerProfiles from "gi://AstalPowerProfiles";
import { IconWithLabelFallback } from "../../../wrappers";
import icons from "../../../../libs/icons";
import { findIcon } from "../../../../utils";
import Wp from "gi://AstalWp";
import { IndicatorMap } from "./IndicatorMap";

export default function (): Widget.Button {
   const indicatorsMap = new IndicatorMap();

   return new Widget.Button({
      className: "indicators",

      child: new Widget.Box({
         setup: (self) => {
            onIndicatorsChanged(indicatorsMap.get());

            indicatorsMap.subscribe((list) => {
               onIndicatorsChanged(list);
            });

            function onIndicatorsChanged(list: Gtk.Widget[]) {
               if (list.length > 0) {
                  self.children = list;
                  self.visible = true;
               } else {
                  self.children = [];
                  self.visible = false;
               }
            }
         },
      }),
   });
}
