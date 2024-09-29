return {
   "lewis6991/gitsigns.nvim", --> latest commit
   event = "VeryLazy",

   config = function()
      require("gitsigns").setup()
   end,
}
