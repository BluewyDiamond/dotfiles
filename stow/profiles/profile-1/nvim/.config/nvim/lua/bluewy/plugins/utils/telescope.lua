return {
   {
      "nvim-telescope/telescope.nvim",
      version = "0.1.*",
      dependencies = { "nvim-lua/plenary.nvim", version = "*" },
   },

   {
      "nvim-telescope/telescope-ui-select.nvim",

      config = function()
         require("telescope").setup({
            extensions = {
               ["ui-select"] = {
                  require("telescope.themes").get_dropdown({}),
               },
            },
         })

         require("telescope").load_extension("ui-select")
      end,
   },
}
