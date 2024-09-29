return {
   "nvim-lualine/lualine.nvim", --> latest commit
   dependencies = {
      "nvim-tree/nvim-web-devicons", --> latest commit
   },

   config = function()
      require("lualine").setup({
         options = {
            theme = "onedark",
         },
      })
   end,
}
