return {
   "nvim-lualine/lualine.nvim",
   commit = "*",
   dependencies = { "nvim-tree/nvim-web-devicons", version = "0.x" },

   config = function()
      require("lualine").setup({
         options = {
            theme = "onedark",
         },
      })
   end,
}
