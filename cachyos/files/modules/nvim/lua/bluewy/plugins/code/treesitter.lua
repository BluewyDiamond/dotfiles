return {
   "nvim-treesitter/nvim-treesitter",

   build = function()
      require("nvim-treesitter.install").update({
         with_sync = true,
      })()
   end,

   config = function()
      local treesitter = require("nvim-treesitter.configs")

      treesitter.setup({
         sync_install = false,
         ignore_install = {},
         modules = {},

         auto_install = true,

         ensure_installed = {
            "vim",
            "regex",

            "lua",
         },

         highlight = {
            enable = true,
         },
      })
   end,
}
