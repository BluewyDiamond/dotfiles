return {
   "mrcjkb/rustaceanvim",
   version = "^5",
   ft = { "rust" },

   config = function()
      vim.g.rust_recommended_style = false
   end,
}
