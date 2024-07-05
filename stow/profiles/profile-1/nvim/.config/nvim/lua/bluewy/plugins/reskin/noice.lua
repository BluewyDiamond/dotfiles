return {
   "folke/noice.nvim",
   version = "4.x",
   event = "VeryLazy",
   opts = {},

   dependencies = {
      { "MunifTanjim/nui.nvim", version = "0.x" },
      {
         "rcarriga/nvim-notify",
         version = "3.x",

         config = function()
            require("notify").setup({
               top_down = false,
            })
         end,
      },
   },

   config = function()
      require("noice").setup({
         lsp = {
            override = {
               ["vim.lsp.util.convert_input_to_markdown_lines"] = true,
               ["vim.lsp.util.stylize_markdown"] = true,
               ["cmp.entry.get_documentation"] = true,
            },
         },

         presets = {
            bottom_search = false,
            command_palette = true,
            long_message_to_split = true,
            inc_rename = true,
            lsp_doc_border = true,
         },
      })
   end,
}
