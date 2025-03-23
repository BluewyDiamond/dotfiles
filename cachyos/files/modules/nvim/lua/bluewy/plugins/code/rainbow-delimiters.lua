return {
   "HiPhish/rainbow-delimiters.nvim",

   config = function()
      local rainbow_delimiters = require("rainbow-delimiters")

      require("rainbow-delimiters.setup").setup({
         strategy = {
            [""] = rainbow_delimiters.strategy["global"],
         },

         query = {
            [""] = "rainbow-delimiters",
            lua = "rainbow-blocks",
         },

         priority = {
            [""] = 110,
            lua = 210,
         },

         highlight = {
            "RainbowDelimiterOrange",
            "RainbowDelimiterViolet",
            "RainbowDelimiterCyan",
         },
      })

      -- mappings
      --
      vim.keymap.set("n", "<leader>trd", function()
         local bufnr = vim.api.nvim_get_current_buf()

         if rainbow_delimiters.is_enabled(bufnr) then
            rainbow_delimiters.disable(bufnr)
            print("rainbow delimiters disabled")
         else
            rainbow_delimiters.enable(bufnr)
            print("rainbow delimiters enabled")
         end
      end, { noremap = true, silent = true, desc = "toggle rainbow delimiters" })
   end,
}
