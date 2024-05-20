return {
   {
      "williamboman/mason.nvim",

      dependencies = {
         "WhoIsSethDaniel/mason-tool-installer.nvim",
      },

      lazy = false,

      config = function()
         require("mason").setup()

         local mason_tool_installer = require("mason-tool-installer")

         mason_tool_installer.setup({
            ensure_installed = {
               "stylua",
            },

            run_on_start = true,
            auto_update = false,
            start_delay = 3000, -- 3 second delay
            debounce_hours = 5,
         })
      end,
   },

   {
      "williamboman/mason-lspconfig.nvim",
      lazy = false,
      opts = {
         auto_install = true,
      },
   },

   {
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

         local servers = {}

         for _, lsp in ipairs(servers) do
            lspconfig[lsp].setup({
               capabilities = capabilities,
            })
         end

         vim.keymap.set("n", "<leader>of", vim.diagnostic.open_float, {})
         vim.keymap.set("n", "gD", vim.lsp.buf.declaration, {})
         vim.keymap.set("n", "gd", vim.lsp.buf.definition, {})
         vim.keymap.set("n", "K", vim.lsp.buf.hover, {})
         vim.keymap.set("n", "gi", vim.lsp.buf.implementation, {})
         vim.keymap.set("n", "<leader>ls", vim.lsp.buf.signature_help, {})
         vim.keymap.set("n", "<leader>D", vim.lsp.buf.type_definition, {})
         vim.keymap.set("n", "<leader>ra", vim.lsp.buf.rename)
         vim.keymap.set("n", "<leader>ca", vim.lsp.buf.code_action, {})
         vim.keymap.set("n", "gr", vim.lsp.buf.references, {})
      end,
   },
}
