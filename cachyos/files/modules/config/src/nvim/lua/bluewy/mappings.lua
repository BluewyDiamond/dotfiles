local mappings = {}

mappings.vim = {
   -- because i use the colemak dh wide mod keyboard layout
   { "n", "<A-u>", "<Up>", { noremap = true, silent = true, desc = "up" } },
   { "n", "<A-i>", "<Right>", { noremap = true, silent = true, desc = "right" } },
   { "n", "<A-e>", "<Down>", { noremap = true, silent = true, desc = "bottom" } },
   { "n", "<A-n>", "<Left>", { noremap = true, silent = true, desc = "left" } },

   { "n", "<C-A-u>", "<C-w>k", { noremap = true, silent = true, desc = "focus upper pane" } },
   { "n", "<C-A-i>", "<C-w>l", { noremap = true, silent = true, desc = "focus right pane" } },
   { "n", "<C-A-e>", "<C-w>j", { noremap = true, silent = true, desc = "focus bottom pane" } },
   { "n", "<C-A-n>", "<C-w>h", { noremap = true, silent = true, desc = "focus left pane" } },

   { "n", "<C-A-S-u>", "<cmd>resize -1<CR>", { noremap = true, silent = true, desc = "focus upper pane" } },
   { "n", "<C-A-S-i>", "<cmd>vertical resize -1<CR>", { noremap = true, silent = true, desc = "focus right pane" } },
   { "n", "<C-A-S-e>", "<cmd>resize +1 <CR>", { noremap = true, silent = true, desc = "focus bottom pane" } },
   { "n", "<C-A-S-n>", "<cmd>vertical resize +1<CR>", { noremap = true, silent = true, desc = "focus left pane" } },

   {
      "n",
      "<leader>ttw",
      "<cmd>%s/\\s\\+$//e<CR>",
      { noremap = true, silent = true, desc = "trim trailing whitespace" },
   },

   {
      "n",
      "<leader>tlw",

      function()
         vim.o.wrap = not vim.o.wrap

         if vim.o.wrap then
            vim.o.linebreak = true
            vim.o.breakindent = true
            print("line wrapping enabled")
         else
            vim.o.linebreak = false
            vim.o.breakindent = false
            print("line wrapping disabled")
         end
      end,

      { noremap = true, silent = true, desc = "toggle line wrapping" },
   },
}

mappings.bufferline = {
   {
      "n",
      "<leader>i",
      "<cmd>BufferLineCycleNext<cr>",
      { noremap = true, silent = true, desc = "next buffer" },
   },
   {
      "n",
      "<leader>n",
      "<cmd>BufferLineCyclePrev<cr>",
      { noremap = true, silent = true, desc = "previous buffer" },
   },

   {
      "n",
      "<leader><leader>i",
      "<cmd>BufferLineMoveNext<cr>",
      { noremap = true, silent = true, desc = "move buffer to the right" },
   },

   {
      "n",
      "<leader><leader>n",
      "<cmd>BufferLineMovePrev<cr>",
      { noremap = true, silent = true, desc = "move buffer to the left" },
   },

   { "n", "<leader>x", "<cmd>bd<cr>", { noremap = true, silent = true, desc = "close buffer" } },
}

mappings.comment = {
   { "n", "<leader>/", "gcc", { desc = "toggle comment", remap = true } },
   { "v", "<leader>/", "gc", { desc = "toggle comment", remap = true } },
}

mappings.conform = {
   {
      "n",
      "<leader>fm",

      function()
         require("conform").format({})
      end,

      { desc = "format code" },
   },
}

-- mappings.fzf_lua = {
--    {
--       "n",
--       "<leader>ff",
--       ":lua require('fzf-lua').files()<CR>",
--       { noremap = true, silent = true, desc = "find files" },
--    },
--
--    {
--       "n",
--       "<leader>fw",
--       ":lua require('fzf-lua').live_grep()<CR>",
--       { noremap = true, silent = true, desc = "find files" },
--    },
-- }

mappings.lsp = {
   {
      "n",
      "<leader>of",
      vim.diagnostic.open_float,
      { noremap = true, silent = true, desc = "open float diagnostics" },
   },

   { "n", "gD", vim.lsp.buf.declaration, { noremap = true, silent = true, desc = "go to declaration" } },
   { "n", "gd", vim.lsp.buf.definition, { noremap = true, silent = true, desc = "go to definition" } },
   { "n", "K", vim.lsp.buf.hover, { noremap = true, silent = true, desc = "hover" } },
   { "n", "gi", vim.lsp.buf.implementation, { noremap = true, silent = true, desc = "go to implementation" } },
   { "n", "<leader>ls", vim.lsp.buf.signature_help, { noremap = true, silent = true, desc = "show signature help" } },
   {
      "n",
      "<leader>D",
      vim.lsp.buf.type_definition,
      { noremap = true, silent = true, desc = "go to type definition" },
   },

   { "n", "<leader>ra", vim.lsp.buf.rename, { noremap = true, silent = true, desc = "refactor rename" } },
   { "n", "<leader>ca", vim.lsp.buf.code_action, { noremap = true, silent = true, desc = "show code actions" } },
   { "n", "gr", vim.lsp.buf.references, { noremap = true, silent = true, desc = "go to references" } },
}

mappings.nvim_lint = {
   {
      "n",
      "<leader>tl",

      function()
         require("lint").try_lint()
      end,

      { desc = "trigger lint" },
   },
}

local gitsigns = require("gitsigns")

mappings.gitsigns = {
   {
      "n",
      "<leader>nh",

      function()
         if vim.wo.diff then
            return "[c"
         end

         vim.schedule(function()
            gitsigns.nav_hunk("next", nil)
         end)
         return "<Ignore>"
      end,

      { noremap = true, silent = true, expr = true, desc = "diff" },
   },

   { "n", "<leader>rh", gitsigns.reset_hunk, { noremap = true, silent = true, desc = "reset hunk" } },
   { "n", "<leader>ph", gitsigns.preview_hunk, { noremap = true, silent = true, desc = "preview hunk" } },
   { "n", "<leader>phi", gitsigns.preview_hunk_inline, { noremap = true, silent = true, desc = "toggle deleted" } },
}

mappings.blame = {
   { "n", "<leader>fu", ":BlameToggle<CR>", { noremap = true, silent = true, desc = "toggle git blame" } },
}

-- mappings.neo_tree = {
--    {
--       "n",
--       "<C-n>",
--       ":Neotree source=filesystem reveal=true position=right toggle<CR>",
--       { noremap = true, silent = true },
--    },
-- }

mappings.rainbow_delimiters = {
   {
      "n",
      "<leader>trd",

      function()
         local rainbow_delimiters = require("rainbow-delimiters")
         local bufnr = vim.api.nvim_get_current_buf()

         if rainbow_delimiters.is_enabled(bufnr) then
            rainbow_delimiters.disable(bufnr)
            print("rainbow delimiters disabled")
         else
            rainbow_delimiters.enable(bufnr)
            print("rainbow delimiters enabled")
         end
      end,

      { noremap = true, silent = true, desc = "toggle rainbow delimiters" },
   },
}

mappings.treesitter = {
   {
      "n",
      "<leader>tsh",
      "<cmd>TSToggle highlight<CR>",
      { noremap = true, silent = true, desc = "toggle syntax highlighting" },
   },
}

mappings.trouble = {
   {
      "n",
      "<leader>ttd",
      "<cmd>Trouble diagnostics toggle<cr>",
      { noremap = true, silent = true, desc = "toggle trouble diagnostics" },
   },
}

local Snacks = require("snacks")

mappings.snacks = {
   {
      "n",
      "<leader>ff",

      function()
         Snacks.picker.files({
            layout = "ivy",
         })
      end,

      { noremap = true, silent = true, desc = "find files" },
   },

   {
      "n",
      "<leader>ff",

      function()
         --- @type snacks.picker.grep.Config
         Snacks.picker.grep({
            layout = "ivy",
         })
      end,

      { noremap = true, silent = true, desc = "find files" },
   },

   {
      "n",
      "<leader>fb",

      function()
         Snacks.picker.buffers({
            layout = "ivy",
         })
      end,

      { noremap = true, silent = true, desc = "find buffers" },
   },

   {
      "n",
      "<C-n>",

      function()
         Snacks.picker.explorer({
            layout = { layout = { position = "right" } },
         })
      end,

      { noremap = true, silent = true, desc = "toggle explorer" },
   },
}

return mappings
