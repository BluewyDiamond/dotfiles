return {
   {
      "hrsh7th/nvim-cmp", --> latest commit
      event = { "BufReadPost", "BufNewFile" },

      dependencies = {
         { "hrsh7th/cmp-nvim-lsp" }, --> latest commit
         { "hrsh7th/cmp-buffer" }, --> latest commit
         { "hrsh7th/cmp-path" }, --> latest commit
         { "L3MON4D3/LuaSnip", version = "2.x" },
         { "saadparwaiz1/cmp_luasnip" }, --> latest commit
         { "rafamadriz/friendly-snippets" }, --> latest commit
         { "onsails/lspkind.nvim" }, --> latest commit
         { "windwp/nvim-ts-autotag" }, --> latest commit
         { "windwp/nvim-autopairs" }, --> latest commit
      },

      config = function()
         local cmp_autopairs = require("nvim-autopairs.completion.cmp")
         local cmp = require("cmp")
         local luasnip = require("luasnip")
         local lspkind = require("lspkind")

         require("nvim-autopairs").setup()

         -- Integrate nvim-autopairs with cmp.
         cmp.event:on("confirm_done", cmp_autopairs.on_confirm_done())

         require("luasnip.loaders.from_vscode").lazy_load()

         cmp.setup({
            snippet = {
               expand = function(args)
                  luasnip.lsp_expand(args.body)
               end,
            },

            window = {
               completion = cmp.config.window.bordered(),
               documentation = cmp.config.window.bordered(),
            },

            mapping = cmp.mapping.preset.insert({
               ["<C-k>"] = cmp.mapping.select_prev_item(), -- previous suggestion
               ["<C-j>"] = cmp.mapping.select_next_item(), -- next suggestion

               ["<Tab>"] = cmp.mapping(function(fallback)
                  if cmp.visible() then
                     cmp.select_next_item()
                  elseif luasnip.expand_or_jumpable() then
                     luasnip.expand_or_jump()
                  else
                     fallback()
                  end
               end, { "i", "s" }),
               ["<S-Tab>"] = cmp.mapping(function(fallback)
                  if cmp.visible() then
                     cmp.select_prev_item()
                  elseif luasnip.jumpable(-1) then
                     luasnip.jump(-1)
                  else
                     fallback()
                  end
               end, { "i", "s" }),

               ["<C-u>"] = cmp.mapping.scroll_docs(4), -- scroll up preview
               ["<C-d>"] = cmp.mapping.scroll_docs(-4), -- scroll down preview
               ["<C-Space>"] = cmp.mapping.complete({}), -- show completion suggestions
               ["<C-c>"] = cmp.mapping.abort(), -- close completion window
               ["<CR>"] = cmp.mapping.confirm({ select = true }), -- select suggestion
            }),

            -- sources for autocompletion
            sources = cmp.config.sources({
               { name = "nvim_lsp" }, -- lsp
               { name = "buffer", max_item_count = 5 }, -- text within current buffer
               { name = "path", max_item_count = 3 }, -- file system paths
               { name = "luasnip", max_item_count = 3 }, -- snippets
            }),

            -- Enable pictogram icons for lsp/autocompletion
            formatting = {
               expandable_indicator = true,

               format = lspkind.cmp_format({
                  mode = "symbol_text",
                  maxwidth = 50,
                  ellipsis_char = "...",
                  symbol_map = {
                     Copilot = "",
                  },
               }),
            },

            experimental = {
               ghost_text = true,
            },
         })
      end,
   },
}
