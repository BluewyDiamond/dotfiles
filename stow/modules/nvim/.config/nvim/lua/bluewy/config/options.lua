vim.g.loaded_ruby_provider = 0
vim.g.loaded_node_provider = 0
vim.g.loaded_perl_provider = 0
vim.g.loaded_python3_provider = 0

vim.g.mapleader = " "

-- line wrapping preferences
vim.o.wrap = false
-- if wrap is enabled:
-- vim.o.linebreak = true
-- vim.o.breakindent = true

-- indentation preferences
vim.o.tabstop = 3
vim.o.softtabstop = 3
vim.o.shiftwidth = 3
vim.o.expandtab = true

-- Use system clipboard.
vim.o.clipboard = "unnamedplus"

-- other stuff
vim.wo.relativenumber = true
vim.o.cursorline = true

-- search stuff
vim.o.ignorecase = true
vim.o.smartcase = true

-- whitespaces stuff
vim.o.list = true

local space = "·"

vim.opt.listchars:append({
   tab = "│─",
   multispace = space,
   lead = space,
   trail = space,
   nbsp = space,
})
