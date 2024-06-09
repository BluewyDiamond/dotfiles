return {
   "williamboman/mason-lspconfig.nvim",
   lazy = false,

   opts = {
      auto_install = true,
   },

   config = function()
      require("mason-lspconfig").setup({
         ensure_installed = {
            "lua_ls",
         },
      })
   end,
}
