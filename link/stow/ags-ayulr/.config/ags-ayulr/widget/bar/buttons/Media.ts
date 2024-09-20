import { type MprisPlayer } from "types/service/mpris"
import PanelButton from "../PanelButton"
import options from "options"
import icons from "lib/icons"
import { icon } from "lib/utils"
import { Opt } from "lib/option"

const mpris = await Service.import("mpris")
const { length, direction, preferred, monochrome, format, charactersToStrip } = options.bar.media

const getPlayer = (name = preferred.value) =>
    mpris.getPlayer(name) || mpris.players[0] || null

const Content = (player: MprisPlayer) => {
    const stripCharacters = (str: string, charactersToStrip: string): string => {
        let result = str;

        for (const char of charactersToStrip) {
            result = result.replace(new RegExp(char, 'g'), '');
        }

        return result;
    };

    const revealer = Widget.Revealer({
        click_through: true,
        visible: length.bind().as(l => l > 0),
        transition: direction.bind().as(d => `slide_${d}` as const),
        setup: self => {
            let current = ""
            self.hook(player, () => {
                if (current === player.track_title)
                    return

                current = player.track_title
                self.reveal_child = true
                Utils.timeout(3000, () => {
                    !self.is_destroyed && (self.reveal_child = false)
                })
            })
        },
        child: Widget.Label({
            truncate: "end",
            max_width_chars: length.bind().as(n => n > 0 ? n : -1),
            label: Utils.merge([
                player.bind("track_title"),
                player.bind("track_artists"),
                format.bind(),
            ], () => {
                let track_title = stripCharacters(player.track_title, charactersToStrip.value)
                let track_artists = stripCharacters(player.track_artists.join(", "), charactersToStrip.value)
                let track_artist = stripCharacters(player.track_artists[0] || "", charactersToStrip.value)
                let track_album = stripCharacters(player.track_album, charactersToStrip.value)
                let name = stripCharacters(player.name, charactersToStrip.value)
                let identity = stripCharacters(player.identity, charactersToStrip.value);

                return `${format}`
                    .replace("{title}", track_title)
                    .replace("{artists}", track_artists)
                    .replace("{artist}", track_artist)
                    .replace("{album}", track_album)
                    .replace("{name}", name)
                    .replace("{identity}", identity)
            })

        }),
    })

    const playericon = Widget.Icon({
        icon: Utils.merge([player.bind("entry"), monochrome.bind()], (entry => {
            const name = `${entry}${monochrome.value ? "-symbolic" : ""}`
            return icon(name, icons.fallback.audio)
        })),
    })

    return Widget.Box({
        attribute: { revealer },
        children: direction.bind().as(d => d === "right"
            ? [playericon, revealer] : [revealer, playericon]),
    })
}

export default () => {
    let player = getPlayer()

    const btn = PanelButton({
        class_name: "media",
        child: Widget.Icon(icons.fallback.audio),
    })

    const update = () => {
        player = getPlayer()
        btn.visible = !!player

        if (!player)
            return

        const content = Content(player)
        const { revealer } = content.attribute
        btn.child = content
        btn.on_primary_click = () => { player.playPause() }
        btn.on_secondary_click = () => { player.playPause() }
        btn.on_scroll_up = () => { player.next() }
        btn.on_scroll_down = () => { player.previous() }
        btn.on_hover = () => { revealer.reveal_child = true }
        btn.on_hover_lost = () => { revealer.reveal_child = false }
    }

    return btn
        .hook(preferred, update)
        .hook(mpris, update, "notify::players")
}
