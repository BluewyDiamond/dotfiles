return {
   "stevearc/conform.nvim",
   opts = {},

   config = function()
      require("conform").setup({
         formatters_by_ft = {
            lua = { "stylua" },
         },
      })

      vim.keymap.set("n", "<leader>fm", function()
         require("conform").format({ lsp_fallback = true })
      end, { desc = "format files" })
   end,
}
