return {
   "nvim-treesitter/nvim-treesitter",

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
