return {
   "akinsho/bufferline.nvim", --> latest commit
   dependencies = { "nvim-tree/nvim-web-devicons" }, --> latest commit

   config = function()
      require("bufferline").setup({
         options = {
            always_show_bufferline = false,
            separator_style = "slant",
         },
      })
   end,
}
