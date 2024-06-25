#!/usr/bin/env fish

set -g SCRIPT (dirname (status -f))'/./list_installed_packages_but_not_in_list.fish'

function main
    set script_output ($SCRIPT)
    set packages_to_choose_from (string split \n $script_output)

    set wanted_packages
    set unwanted_packages

    for package_to_choose_from in $packages_to_choose_from
        echo "Do you want? -> $package_to_choose_from"

        read -P "script => Input -- " choice

        if string match -q -i -- $choice n
            set unwanted_packages $unwanted_packages $package_to_choose_from
        else
            set wanted_packages $wanted_packages $package_to_choose_from
        end
    end

    echo $unwanted_packages
end

###################
main
