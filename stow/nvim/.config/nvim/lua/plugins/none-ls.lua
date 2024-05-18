return {
   "nvimtools/none-ls.nvim",
   config = function()
      local null_ls = require("null-ls")
      null_ls.setup({
         sources = {
            null_ls.builtins.formatting.stylua,
            null_ls.builtins.formatting.fish_indent,
            null_ls.builtins.formatting.prettier,
            null_ls.builtins.formatting.rustfmt,
         },
      })

      vim.keymap.set("n", "<leader>fm", vim.lsp.buf.format, {})
   end,
}
