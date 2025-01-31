return {
   "stevearc/conform.nvim",

   config = function()
      require("conform").setup({
         formatters_by_ft = {
            -- common
            fish = { "fish_indent" },
            lua = { "stylua" },

            -- programming langauges
            csharp = { "dotnet tool run dotnet-csharpier ." },
            javascript = { "prettier" },
            python = { "black" },
            php = { "pretty-php" },
            rust = { "rustfmt" },
            typescript = { "prettier" },
            vala = { "uncrustify" },

            -- data formats
            json = { "prettier" },
            jsonc = { "prettier" },
            toml = { "taplo" },

            -- other
            css = { "prettier" },
            scss = { "prettier" },
            html = { "prettier" },
         },
      })
   end,
}
