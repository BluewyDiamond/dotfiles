return {
   "lewis6991/gitsigns.nvim",
   version = "0.*",
   event = "VeryLazy",

   config = function()
      require("gitsigns").setup()
   end,
}
