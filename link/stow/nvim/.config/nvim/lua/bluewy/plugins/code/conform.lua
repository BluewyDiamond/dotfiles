return {
   "stevearc/conform.nvim",
   version = "6.x",

   config = function()
      require("conform").setup({
         formatters_by_ft = {
            -- common
            lua = { "stylua" },
            fish = { "fish_indent" },

            -- low level
            rust = { "rustfmt" },

            -- high level
            javascript = { "prettier" },
            typescript = { "prettier" },
            css = { "prettier" },
            python = { "black" },
            php = { "pretty-php" },

            -- other
            json = { "prettier" },
            jsonc = { "prettier" },
            toml = { "taplo" },
         },
      })
   end,
}
