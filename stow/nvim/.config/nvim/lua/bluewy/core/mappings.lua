local map = vim.keymap.set

-- telescope
map("n", "<leader>ff", "<cmd>Telescope find_files<CR>", { noremap = true, silent = true })
map("n", "<leader>fw", "<cmd>Telescope live_grep<CR>", { noremap = true, silent = true })
map("n", "<leader>fb", "<cmd>Telescope buffers<CR>", { noremap = true, silent = true })
map("n", "<leader>cm", "<cmd>Telescope git_commits<CR>", { noremap = true, silent = true })
map("n", "<leader>gt", "<cmd>Telescope git_status<CR>", { noremap = true, silent = true })

map(
   "n",
   "<leader>fa",
   "<cmd>Telescope find_files follow=true no_ignore=true hidden=true<CR>",
   { noremap = true, silent = true }
)

map("n", "<leader>fz", "<cmd>Telescope current_buffer_fuzzy_find<CR>", { noremap = true, silent = true })

-- comment
map("n", "<leader>/", "gcc", { desc = "comment toggle", remap = true })
map("v", "<leader>/", "gc", { desc = "comment toggle", remap = true })

-- nvim-lspconfig
map("n", "<leader>of", vim.diagnostic.open_float, {})
map("n", "gD", vim.lsp.buf.declaration, {})
map("n", "gd", vim.lsp.buf.definition, {})
map("n", "K", vim.lsp.buf.hover, {})
map("n", "gi", vim.lsp.buf.implementation, {})
map("n", "<leader>ls", vim.lsp.buf.signature_help, {})
map("n", "<leader>D", vim.lsp.buf.type_definition, {})
map("n", "<leader>ra", vim.lsp.buf.rename)
map("n", "<leader>ca", vim.lsp.buf.code_action, {})
map("n", "gr", vim.lsp.buf.references, {})

-- conform
local conform = require("conform")

map("n", "<leader>fm", function()
   conform.format({ lsp_fallback = true })
end, { desc = "format files" })

-- nvim-lint
local lint = require("lint")

map("n", "<leader>lt", function()
   lint.try_lint()
end, { desc = "Trigger linting for current file" })

-- git-signs
local gitsigns = require("gitsigns")

map("n", "]c", function()
   if vim.wo.diff then
      return "]c"
   end
   vim.schedule(gitsigns.next_hunk)

   return "<Ignore>"
end, { noremap = true, silent = true, expr = true })

map("n", "[c", function()
   if vim.wo.diff then
      return "[c"
   end
   vim.schedule(gitsigns.prev_hunk)
   return "<Ignore>"
end, { noremap = true, silent = true, expr = true })

map("n", "<leader>rh", gitsigns.reset_hunk, { noremap = true, silent = true })
map("n", "<leader>ph", gitsigns.preview_hunk, { noremap = true, silent = true })
map("n", "<leader>gb", package.loaded.gitsigns.blame_line, { noremap = true, silent = true })
map("n", "<leader>td", gitsigns.toggle_deleted, { noremap = true, silent = true })

-- vim-fugitive
map("n", "<leader>fu", ":Git blame <CR>", {})

-- neo-tree
map("n", "<C-n>", ":Neotree source=filesystem reveal=true position=right toggle<CR>", { noremap = true, silent = true })
map("n", "<leader>bf", ":Neotree buffers reveal float<CR>", { noremap = true, silent = true })

-- rainbow delimiters
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

map("n", "<leader>trd", function()
   toggle_rainbow_delimiters()
end, { noremap = true, silent = true })
