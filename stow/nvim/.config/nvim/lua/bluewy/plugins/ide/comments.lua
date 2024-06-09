return {
   "numToStr/Comment.nvim",
   lazy = false,
   config = function()
      local comment = require("Comment.api")

      vim.keymap.set("n", "<leader>/", comment.toggle.linewise.current, { noremap = true, silent = true })
      vim.keymap.set(
         "v",
         "<leader>/",
         "<ESC><cmd>lua require('Comment.api').toggle.linewise(vim.fn.visualmode())<CR>",
         { noremap = true, silent = true }
      )
   end,
}
