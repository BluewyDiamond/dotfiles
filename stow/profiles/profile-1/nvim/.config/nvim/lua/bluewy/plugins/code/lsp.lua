return {
   "williamboman/mason.nvim",
   version = "1.*",
   lazy = false,

   dependencies = {
      { "neovim/nvim-lspconfig", version = "0.*", lazy = false },
      { "williamboman/mason-lspconfig.nvim", version = "1.*", lazy = false },
   },

   config = function()
      require("mason").setup({
         PATH = "append",
      })

      require("mason-lspconfig").setup({
         ensure_installed = {
            "lua_ls",
         },
      })

      local capabilities = vim.lsp.protocol.make_client_capabilities()
      local ok, cmp_nvim_lsp = pcall(require, "cmp_nvim_lsp")

      if ok then
         capabilities = cmp_nvim_lsp.default_capabilities()
      else
         vim.notify(
            "Unable to load 'cmp-nvim-lsp' defaulting to none.",
            vim.log.levels.ERROR,
            { title = "BLUEWY'S MESSAGE" }
         )
      end

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
            -- We leave it blank because we setup it up with rustacevim.
         end,
      })
   end,
}
