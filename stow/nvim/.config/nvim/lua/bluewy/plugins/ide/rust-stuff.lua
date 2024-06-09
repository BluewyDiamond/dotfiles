return {
   {
      "mrcjkb/rustaceanvim",
      version = "^4", -- Recommended
      ft = { "rust" },
      config = function()
         vim.g.rust_recommended_style = false
      end,
   },

   {
      "saecki/crates.nvim",
      tag = "stable",
      config = function()
         require("crates").setup()
      end,
   },
}
