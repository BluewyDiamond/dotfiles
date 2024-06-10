return {
   "stevearc/conform.nvim",
   opts = {},

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
            python = { "black" },
         },
      })

      vim.keymap.set("n", "<leader>fm", function()
         require("conform").format({ lsp_fallback = true })
      end, { desc = "format files" })
   end,
}
