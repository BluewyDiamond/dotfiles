return {
   "akinsho/bufferline.nvim",
   version = "4.*",
   dependencies = {"nvim-tree/nvim-web-devicons", version = "0.*"},

   config = function()
      require("bufferline").setup({
         options = {
            always_show_bufferline = false,
            separator_style = "slant",
         },
      })
   end,
}
