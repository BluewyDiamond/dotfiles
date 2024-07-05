return {
   {
      "folke/lazydev.nvim",
      version = "1.x",
      ft = "lua", -- only load on lua files

      opts = {
         library = {
            -- See the configuration section for more details
            -- Load luvit types when the `vim.uv` word is found
            { path = "luvit-meta/library", words = { "vim%.uv" } },
         },
      },
   },

   { "Bilal2453/luvit-meta", lazy = true }, --> latest commit -- optional `vim.uv` typings

   { -- optional completion source for require statements and module annotations
      "hrsh7th/nvim-cmp", --> latest commit

      opts = function(_, opts)
         opts.sources = opts.sources or {}
         table.insert(opts.sources, {
            name = "lazydev",
            group_index = 0, -- set group index to 0 to skip loading LuaLS completions
         })
      end,
   },
}
