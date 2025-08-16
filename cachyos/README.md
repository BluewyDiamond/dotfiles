# System Configuration Guide

---

## 1. Configure Motherboard

### RAM Settings
- **RAM EXPO**: `expo_2`
- **Memory Context Restore**: `enabled`
- **Power Down**: `enabled`

### CPU Settings
- **PBO Limits**: `disabled` (to prevent extra power draw)
- **Curve Optimizer**: `-20`
- **CPU Platform Temperature Limit**: `84°C`
- **CPU Core Voltage (SOC)**: `1.08v`

### Boot Settings
- **CSM**: `disabled`
- **Fast Boot**: `disabled`

### Other Settings
- **TPM 2.0**: `disabled`
- **Integrated Graphics**: `disabled`
- **Fan Profiles**: `custom`
- **Smart Resizable BAR**: `on`
- **Applications Stuff**: `disabled`

---

## 2. Setup Dotfiles
- setup files
- setup apps
- setup network.

---

## 3. Configure Graphics Card

### Fan Settings
- **Fan Tracking Temperature**: `junction`
- **Fan Profile**:
  - `44°C`: `0%`
  - `45°C`: `13%` (minimum required to spin fans)
  - `49°C`: `13%`
  - `55°C`: `25%`
  - `70°C`: `50%`
  - `80°C`: `100%`
- **Spin Down Delay**: `3000ms`
- **Speed Change Threshold**: `3°C`

### Performance Settings
- **Power Draw**: `allow_max`
- **Performance Profile**: `3d_fullscreen`

---

## 4. Setup Optimizations

### Kernel Parameters
Add the following parameters to your kernel configuration:
- `quiet`
- `random.trust_cpu=on`
- `amdgpu.ppfeaturemask=0xffffffff`
- `vt_colors...`

### Initramfs
- Use `booster` for initramfs.

### Uninstall Unwanted Packages
- Run reinstall minimal packages script.
- Run install packages script.

### Disable Unwanted Startup Services
- ...

---

## 6. Miscellaneous
- Ensure compliance with wireless regulations.
