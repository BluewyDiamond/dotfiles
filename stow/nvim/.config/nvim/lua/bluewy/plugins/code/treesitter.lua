return {
   "nvim-treesitter/nvim-treesitter",

   -- Update parsers to work with the latest version of the plugin to avoid breaking anything.
   build = function()
      require("nvim-treesitter.install").update({
         with_sync = true,
      })()
   end,

   config = function()
      require("nvim-treesitter.configs").setup({
         auto_install = true,

         ensure_installed = {
            "vim",
            "regex",

            "lua",
         },
      })
   end,
}
