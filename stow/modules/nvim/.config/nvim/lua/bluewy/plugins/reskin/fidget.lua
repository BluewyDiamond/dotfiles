return {
   "j-hui/fidget.nvim",
   version = "1.x",
   event = { "BufEnter" },

   config = function()
      -- Turn on LSP, formatting, and linting status and progress information.
      require("fidget").setup({
         text = {
            spinner = "dots_negative",
         },
      })
   end,
}
