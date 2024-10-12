return {
   "williamboman/mason.nvim",
   version = "1.x",
   lazy = false,

   dependencies = {
      { "neovim/nvim-lspconfig", version = "0.x", lazy = false },
      { "williamboman/mason-lspconfig.nvim", version = "1.x", lazy = false },
   },

   config = function()
      require("mason").setup({})

      require("mason-lspconfig").setup({
         ensure_installed = {
            "lua_ls",
         },
      })

      local capabilities = require("cmp_nvim_lsp").default_capabilities()

      require("mason-lspconfig").setup_handlers({
         function(server_name)
            require("lspconfig")[server_name].setup({
               capabilities = capabilities,
            })
         end,

         ["rust_analyzer"] = function()
            -- We leave it blank because we setup it up with rustacevim.
         end,

         -- this has been refactored to ts_ls but does not it has been done properly
         ["tsserver"] = function() end,
         ["ts_ls"] = function() end,
      })
   end,
}
