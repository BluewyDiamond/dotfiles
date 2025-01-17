return {
   "akinsho/bufferline.nvim",
   dependencies = { "nvim-tree/nvim-web-devicons" },

   config = function()
      require("bufferline").setup({
         options = {
            always_show_bufferline = false,
            separator_style = "slant",
         },
      })
   end,
}
