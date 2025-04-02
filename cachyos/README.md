# System Configuration Guide

---

## 1. Configure Motherboard

### RAM Settings
- **RAM EXPO**: `expo_2`
- **Memory Context Restore**: `enabled`
- **Power Down**: `enabled`

### CPU Settings
- **Medium Load Boostit**: `enabled`
- **PBO Limits**: `disabled` (to prevent extra power draw)
- **CPU Boost Clock Override**: `disabled`
- **Curve Optimizer**: `-30`
- **CPU Platform Temperature Limit**: `85°C`

- **CPU Core Voltage (SOC)**: `1.075v`
- **Core Performance Boost**: `disabled`

### Boot Settings
- **Smart Resizable BAR**: `on`
- **CSM**: `disabled`
- **Secure Boot**: `disabled`

### Other Settings
- **Fan Profiles**: `custom`
- **Integrated Graphics**: `disabled`
- **TPM 2.0**: `disabled`

---

## 2. Setup Dotfiles
- Run copy + link files script.
- Configure network (systemd-networkd or NetworkManager).

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
