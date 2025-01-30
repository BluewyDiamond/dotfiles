vim.g.mapleader = " "

vim.o.wrap = false

vim.o.tabstop = 3
vim.o.softtabstop = 3
vim.o.shiftwidth = 3
vim.o.expandtab = true

vim.o.clipboard = "unnamedplus"

vim.o.relativenumber = true
vim.o.cursorline = true

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
