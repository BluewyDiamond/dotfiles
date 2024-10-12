return {
   "nvim-treesitter/nvim-treesitter",
   version = "0.x",

   -- Update parsers to work with the latest version of the plugin to avoid breaking anything.
   build = function()
      require("nvim-treesitter.install").update({
         with_sync = true,
      })()
   end,

   config = function()
      require("nvim-treesitter.configs").setup({
         sync_install = false,
         ignore_install = {},
         modules = {},

         auto_install = true,

         ensure_installed = {
            "vim",
            "regex",

            "lua",
         },
      })
   end,
}
