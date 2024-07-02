return {
   "akinsho/bufferline.nvim",
   version = "4.6.1",
   dependencies = "nvim-tree/nvim-web-devicons",

   config = function()
      require("bufferline").setup({
         options = {
            always_show_bufferline = false,
            separator_style = "slant",
         },
      })
   end,
}
