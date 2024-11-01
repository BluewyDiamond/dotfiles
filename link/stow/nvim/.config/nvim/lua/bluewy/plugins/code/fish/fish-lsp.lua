return {
   "ndonfris/fish-lsp",
   config = function()
      vim.cmd([[
	autocmd BufWritePre,BufEnter *.fish lua vim.lsp.start({name='fish-lsp', cmd = {'fish-lsp', 'start'}, filetypes = {'fish'}})
	autocmd CursorHold  <silent><buffer> lua vim.lsp.buf.document_highlight()
	autocmd CursorHoldI <silent><buffer> lua vim.lsp.buf.document_highlight()
	autocmd CursorMoved <silent><buffer> lua vim.lsp.buf.clear_references()
    ]])
   end,
}
