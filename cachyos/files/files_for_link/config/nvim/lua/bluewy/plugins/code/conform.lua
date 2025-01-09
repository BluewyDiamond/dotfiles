return {
   "stevearc/conform.nvim",
   version = "6.x",

   config = function()
      require("conform").setup({
         formatters_by_ft = {
            -- common
            fish = { "fish_indent" },
            lua = { "stylua" },

            -- programming langauges
            javascript = { "prettier" },
            python = { "black" },
            php = { "pretty-php" },
            rust = { "rustfmt" },
            typescript = { "prettier" },

            -- data formats
            json = { "prettier" },
            jsonc = { "prettier" },
            toml = { "taplo" },

            -- other
            css = { "prettier" },
            scss = { "prettier" },
         },
      })
   end,
}
