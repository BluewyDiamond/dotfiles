return {
   "williamboman/mason.nvim", --> latest commit
   lazy = false,

   dependencies = {
      { "neovim/nvim-lspconfig", lazy = false }, --> latest commit
      { "williamboman/mason-lspconfig.nvim",  lazy = false }, --> latest commit
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
         function(server_name) -- default handler (optional)
            require("lspconfig")[server_name].setup({
               capabilities = capabilities,
            })
         end,

         ["rust_analyzer"] = function()
            -- We leave it blank because we setup it up with rustacevim.
         end,

         ["ts_ls"] = function()
            -- We leave it blank because we setup it up with typescript tools.
         end,
      })
   end,
}
