return {
   "stevearc/conform.nvim", --> latest commit

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
            php = { "php-cs-fixer" },

            -- other
            json = { "prettier" },
            jsonc = { "prettier" },
            toml = { "taplo" },
         },

         formatters = {
            ["php-cs-fixer"] = {
               command = "php-cs-fixer",
               args = {
                  "fix",
                  "$FILENAME",
               },
               stdin = false,
            },
         },
      })
   end,
}
