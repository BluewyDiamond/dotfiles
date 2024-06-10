return {
   "neovim/nvim-lspconfig",
   lazy = false,

   config = function()
      local lspconfig = require("lspconfig")
      local capabilities = require("cmp_nvim_lsp").default_capabilities()

      lspconfig.lua_ls.setup({
         capabilities = capabilities,

         settings = {
            Lua = {
               diagnostics = {
                  globals = { "vim" },
               },

               workspace = {
                  library = {
                     [vim.fn.expand("$VIMRUNTIME/lua")] = true,
                     [vim.fn.expand("$VIMRUNTIME/lua/vim/lsp")] = true,
                  },
               },
            },
         },
      })

      local servers = { "clangd" }

      for _, lsp in ipairs(servers) do
         lspconfig[lsp].setup({
            capabilities = capabilities,
         })
      end
   end,
}
