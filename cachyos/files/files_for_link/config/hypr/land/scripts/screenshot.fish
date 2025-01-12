#!/usr/bin/env fish

set SCRIPT_NAME (basename (status filename))
set file $HOME/media/screenshots/(date +"%Y-%m-%d_%H-%M-%S").png

if not which wayshot >/dev/null
    notify-send "$SCRIPT_NAME" "Wayshot not found..."
    return
end

if string match -i -q -- $argv[1] partial
    if not which slurp >/dev/null
        notify-send "$SCRIPT_NAME" "Slurp not found..."
        return
    end

    if wayshot -f $file -s (slurp)
        wl-copy <$file
        set result (notify-send Screenshot "$file" -h STRING:"image-path":"$file" --action="show_in_files=Show In Files" --action="open=Open" --action="edit=Edit")

        switch $result
            case "*show_in_files*"
                xdg-open dirname $file
            case "*open*"
                xdg-open $file
            case "*edit*"
                satty -f $file
        end
    end

    wl-copy <$file
else
    if wayshot -f $file
        wl-copy <$file
        set result (notify-send Screenshot "$file" -h STRING:"image-path":"$file" --action="show_in_files=Show In Files" --action="open=Open" --action="edit=Edit")

        switch $result
            case "*show_in_files*"
                xdg-open dirname $file
            case "*open*"
                xdg-open $file
            case "*edit*"
                satty -f $file
        end
    end
end
