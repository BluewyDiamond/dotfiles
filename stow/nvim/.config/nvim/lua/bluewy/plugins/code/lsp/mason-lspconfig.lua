return {
   "williamboman/mason-lspconfig.nvim",
   lazy = false,

   dependencies = {
      "neovim/nvim-lspconfig",
      lazy = false,
   },

   config = function()
      require("mason-lspconfig").setup({
         ensure_installed = {
            "lua_ls",
         },
      })

      local capabilities = require("cmp_nvim_lsp").default_capabilities()

      require("mason-lspconfig").setup_handlers({
         -- The first entry (without a key) will be the default handler
         -- and will be called for each installed server that doesn't have
         -- a dedicated handler.

         function(server_name) -- default handler (optional)
            require("lspconfig")[server_name].setup({
               capabilities = capabilities,
            })
         end,

         -- Next, you can provide a dedicated handler for specific servers.
         -- For example, a handler override for the `rust_analyzer`:
         -- ["rust_analyzer"] = function()
         --    require("rust-tools").setup({})
         -- end,

         ["lua_ls"] = function()
            require("lspconfig")["lua_ls"].setup({
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
         end,

         ["rust_analyzer"] = function()
            -- We leave it blank so it does not conflict with rustace.
         end,
      })
   end,
}
