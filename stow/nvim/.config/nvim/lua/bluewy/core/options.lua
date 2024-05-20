vim.g.loaded_ruby_provider = 0
vim.g.loaded_node_provider = 0
vim.g.loaded_perl_provider = 0
vim.g.loaded_python3_provider = 0

vim.g.mapleader = " "

-- line wrapping prefenrences
vim.o.wrap = false
vim.o.linebreak = true
vim.o.breakindent = true

-- indentation preferences
vim.o.shiftwidth = 3
vim.o.expandtab = true
vim.o.softtabstop = 3

-- Use system clipboard.
vim.o.clipboard = "unnamedplus"

vim.wo.number = true

vim.o.cursorline = true

vim.o.ignorecase = true
vim.o.smartcase = true

vim.o.list = true

local space = "·"

vim.opt.listchars:append({
   tab = "│─",
   multispace = space,
   lead = space,
   trail = space,
   nbsp = space,
})
