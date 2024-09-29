return {
   "HiPhish/rainbow-delimiters.nvim", --> latest commit

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
   end,
}
