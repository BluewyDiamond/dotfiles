return {
   "mrcjkb/rustaceanvim",
   version = "^5", -- Recommended
   ft = { "rust" },

   config = function()
      vim.g.rust_recommended_style = false
   end,
}
