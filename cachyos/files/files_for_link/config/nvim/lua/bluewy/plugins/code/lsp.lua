return {
   {
      "williamboman/mason.nvim",
      lazy = false,

      config = function()
         require("mason").setup({})
      end,
   },

   {
      "williamboman/mason-lspconfig.nvim",
      lazy = false,

      config = function()
         require("mason-lspconfig").setup({
            ensure_installed = {
               "lua_ls",
            },

            automatic_installation = true,
         })
      end,
   },

   {
      "neovim/nvim-lspconfig",
      lazy = false,

      config = function()
         local mason_lspconfig = require("mason-lspconfig")
         local lspconfig = require("lspconfig")
         local capabilities = require("cmp_nvim_lsp").default_capabilities()

         local installed_servers = mason_lspconfig.get_installed_servers()
         local excluded_servers = { "rust_analyzer", "ts_ls" }

         local override_servers = {
            rust_analyzer = function() end,
            ts_ls = function() end,
         }

         local function contains(server_name)
            for _, excluded in ipairs(excluded_servers) do
               if excluded == server_name then
                  return true
               end
            end
            return false
         end

         for _, server_name in ipairs(installed_servers) do
            if not contains(server_name) then
               if override_servers[server_name] then
                  override_servers[server_name]()
               else
                  lspconfig[server_name].setup({
                     capabilities = capabilities,
                  })
               end
            end
         end

         lspconfig.fish_lsp.setup({})
      end,
   },
}
