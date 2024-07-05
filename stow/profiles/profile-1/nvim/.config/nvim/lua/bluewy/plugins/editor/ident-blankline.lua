return {
   "lukas-reineke/indent-blankline.nvim",
   version = "3.x",
   event = "BufEnter",
   main = "ibl",
   opts = {},

   config = function()
      require("ibl").setup({
         indent = { char = "┃" },
         scope = {
            enabled = false,
            show_start = false,
            show_end = false,
         },
      })
   end,
}
