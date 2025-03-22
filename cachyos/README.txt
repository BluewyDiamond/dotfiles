"1. Configure motherboard" {
   motherboard {
      ram_expo = expo_tweaked
      memory_context_restore = enabled
      power_down = enabled

      pbo_limits = disabled // as in don't draw extra power
      curve_optimizer = -30
      cpu_platform_temperature_limit = 85

      cpu_core_voltage = 1.075v // can be found as "soc"

      smart_resizable_bar = on
      csm = disabled
      secure_boot = disabled
      fan_profiles = custom
      integrated_graphics = false

      tpm_2.0 = false
   }
}

"2. Setup dotfiles" {}

"3. Configure graphics card" {
   gpu {
      fan_tracking_temperature = junction

      fan_profile = {
         44 = 0,
         45 = 0.13, // minimum required to spin the fans
         49 = 0.13,
         55 = 0.25,
         70 = 0.5,
         80 = 1
      }

      spin_down_delay = 3000ms
      speed_change_threshold = 3celcius
      power_draw = allow_max
      performance_profile = 3d_fullscreen
   }
}

"4. Disable unwanted startup services"

"5. Setup optimizations" {
   kernel {
      parameters = ["quiet", "random.trust_cpu=on", "amdgpu.ppfeaturemask=0xffffffff", "vt_colors..."]
   }

   initramfs = booster
}

"6. Misc" {
   comply_with_wireless_regulations
}
