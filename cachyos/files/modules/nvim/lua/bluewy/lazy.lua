local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"

if not vim.loop.fs_stat(lazypath) then
   vim.fn.system({
      "git",
      "clone",
      "--filter=blob:none",
      "https://github.com/folke/lazy.nvim.git",
      "--branch=stable", -- latest stable release
      lazypath,
   })
end

vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
   { import = "bluewy.plugins.code" },
   { import = "bluewy.plugins.bundles" },
   { import = "bluewy.plugins.code.git" },
   { import = "bluewy.plugins.code.rust" },
   { import = "bluewy.plugins.code.lua" },
   { import = "bluewy.plugins.editor" },
   { import = "bluewy.plugins.reskin" },
})
