local mappings = {}

-- telescope
mappings.telescope = {
   { "n", "<leader>ff", "<cmd>Telescope find_files<CR>", { noremap = true, silent = true } },
   { "n", "<leader>fw", "<cmd>Telescope live_grep<CR>", { noremap = true, silent = true } },
   { "n", "<leader>fb", "<cmd>Telescope buffers<CR>", { noremap = true, silent = true } },
   { "n", "<leader>cm", "<cmd>Telescope git_commits<CR>", { noremap = true, silent = true } },
   { "n", "<leader>gt", "<cmd>Telescope git_status<CR>", { noremap = true, silent = true } },

   {
      "n",
      "<leader>fa",
      "<cmd>Telescope find_files follow=true no_ignore=true hidden=true<CR>",
      { noremap = true, silent = true },
   },

   { "n", "<leader>fz", "<cmd>Telescope current_buffer_fuzzy_find<CR>", { noremap = true, silent = true } },
}

mappings.comment = {
   { "n", "<leader>/", "gcc", { desc = "comment toggle", remap = true } },
   { "v", "<leader>/", "gc", { desc = "comment toggle", remap = true } },
}

mappings.lsp = {
   { "n", "<leader>of", vim.diagnostic.open_float, {} },
   { "n", "gD", vim.lsp.buf.declaration, {} },
   { "n", "gd", vim.lsp.buf.definition, {} },
   { "n", "K", vim.lsp.buf.hover, {} },
   { "n", "gi", vim.lsp.buf.implementation, {} },
   { "n", "<leader>ls", vim.lsp.buf.signature_help, {} },
   { "n", "<leader>D", vim.lsp.buf.type_definition, {} },
   { "n", "<leader>ra", vim.lsp.buf.rename },
   { "n", "<leader>ca", vim.lsp.buf.code_action, {} },
   { "n", "gr", vim.lsp.buf.references, {} },
}

local conform = require("conform")

mappings.conform = {
   {
      "n",
      "<leader>fm",
      function()
         conform.format({ lsp_fallback = true })
      end,
      { desc = "format files" },
   },
}

local lint = require("lint")

mappings.nvim_lint = {
   {
      "n",
      "<leader>lt",
      function()
         lint.try_lint()
      end,
      { desc = "Trigger linting for current file" },
   },
}

-- git-signs
local gitsigns = require("gitsigns")

mappings.gitsigns = {
   {
      "n",
      "[c",
      function()
         if vim.wo.diff then
            return "[c"
         end
         vim.schedule(gitsigns.prev_hunk)
         return "<Ignore>"
      end,
      { noremap = true, silent = true, expr = true },
   },

   { "n", "<leader>rh", gitsigns.reset_hunk, { noremap = true, silent = true } },
   { "n", "<leader>ph", gitsigns.preview_hunk, { noremap = true, silent = true } },
   { "n", "<leader>gb", package.loaded.gitsigns.blame_line, { noremap = true, silent = true } },
   { "n", "<leader>td", gitsigns.toggle_deleted, { noremap = true, silent = true } },
}

mappings.vim_fugitive = {
   { "n", "<leader>fu", ":Git blame <CR>", {} },
}

mappings.neo_tree = {
   {
      "n",
      "<C-n>",
      ":Neotree source=filesystem reveal=true position=right toggle<CR>",
      { noremap = true, silent = true },
   },

   { "n", "<leader>bf", ":Neotree buffers reveal float<CR>", { noremap = true, silent = true } },
}

local rainbow_delimiters = require("rainbow-delimiters")

local function toggle_rainbow_delimiters()
   local bufnr = vim.api.nvim_get_current_buf()

   if rainbow_delimiters.is_enabled(bufnr) then
      rainbow_delimiters.disable(bufnr)
      print("Rainbow delimiters disabled")
   else
      rainbow_delimiters.enable(bufnr)
      print("Rainbow delimiters enabled")
   end
end

mappings.rainbow_delimiters = {
   {
      "n",
      "<leader>trd",
      function()
         toggle_rainbow_delimiters()
      end,
      { noremap = true, silent = true },
   },
}

mappings.bufferline = {
   { "n", "<leader>bn", "<cmd>BufferLineCycleNext<cr>", { noremap = true, silent = true } },
}

return mappings
