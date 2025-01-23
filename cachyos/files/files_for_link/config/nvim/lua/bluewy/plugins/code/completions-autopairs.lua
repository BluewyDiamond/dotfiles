return {
   {
      "hrsh7th/nvim-cmp", --> latest commit

      dependencies = {
         "hrsh7th/cmp-nvim-lsp", --> latest comimt
         "hrsh7th/cmp-path", --> latest commit
         "windwp/nvim-autopairs", --> latest commit
         {
            "L3MON4D3/LuaSnip",

            dependencies = {
               "saadparwaiz1/cmp_luasnip",
               "rafamadriz/friendly-snippets",
            },
         },
      },

      config = function()
         local cmp = require("cmp")
         require("luasnip.loaders.from_vscode").lazy_load()
         require("nvim-autopairs").setup()
         local cmp_autopairs = require("nvim-autopairs.completion.cmp")

         cmp.event:on("confirm_done", cmp_autopairs.on_confirm_done())

         cmp.setup({
            snippet = {
               expand = function(args)
                  require("luasnip").lsp_expand(args.body)
               end,
            },

            window = {
               completion = cmp.config.window.bordered(),
               documentation = cmp.config.window.bordered(),
            },

            mapping = cmp.mapping.preset.insert({
               ["<C-f>"] = cmp.mapping.scroll_docs(4), -- scroll up preview
               ["<C-b>"] = cmp.mapping.scroll_docs(-4), -- scroll down preview
               ["<C-Space>"] = cmp.mapping.complete({}), -- show completion suggestions
               ["<C-c>"] = cmp.mapping.abort(), -- close completion window
               ["<CR>"] = cmp.mapping.confirm({ select = true }), -- select suggestion
            }),

            sources = cmp.config.sources({
               { name = "nvim_lsp" }, -- lsp
               { name = "buffer", max_item_count = 5 }, -- text within current buffer
               { name = "path", max_item_count = 3 }, -- file system paths
               { name = "luasnip", max_item_count = 3 }, -- snippets
            }, {}),
         })
      end,
   },

   {
      "windwp/nvim-ts-autotag", --> latest commit

      config = function()
         require("nvim-ts-autotag").setup()
      end,
   },
}
