# My Dotfiles

This repository contains my personal configuration files (dotfiles) for various applications and tools.

## Requirements

Make sure you have the following tools installed on your system:

- **git**: For cloning this repository.
- **stow**: For managing symlinks to the dotfiles.

## Installation

Follow these steps to set up the dotfiles:

1. **Clone the repository to your home directory:**
    ```shell
    git clone https://github.com/BluewyDiamond/dotfiles.git $HOME/dotfiles
    ```

2. **Change to the cloned repository directory and stow directory:**
    ```shell
    cd $HOME/dotfiles/stow
    ```

3. **Use `stow` to set up the desired configuration:**
    ```shell
    stow <PACKAGE_NAME> -t $HOME
    ```
   Replace `<PACKAGE_NAME>` with the name of the configuration package you want to use (e.g., `vim`, `zsh`, `git`).

## Using Fish Shell

If you're using the Fish shell, you can set up all configurations at once with the following command:

```fish
for file in *
    stow $file -t $HOME
end
