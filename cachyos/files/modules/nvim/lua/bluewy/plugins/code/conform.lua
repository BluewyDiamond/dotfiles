return {
   "stevearc/conform.nvim",

   config = function()
      local conform = require("conform")

      conform.setup({
         formatters_by_ft = {
            -- default
            --
            fish = { "fish_indent" },
            lua = { "stylua" },

            -- programming languages
            --
            csharp = { "dotnet tool run dotnet-csharpier ." },
            javascript = { "prettier" },
            python = { "black" },
            php = { "pretty-php" },
            rust = { "rustfmt" },
            typescript = { "prettier" },
            vala = { "uncrustify" },

            -- markup languages
            css = { "prettier" },
            scss = { "prettier" },
            html = { "prettier" },

            -- data formats
            --
            json = { "prettier" },
            jsonc = { "prettier" },
            toml = { "taplo" },
         },
      })

      -- mappings
      --
      vim.keymap.set("n", "<leader>fm", function()
         conform.format({})
      end, { desc = "format code" })
   end,
}
