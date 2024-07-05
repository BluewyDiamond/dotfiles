return {
   {
      "nvim-telescope/telescope.nvim",
      version = "0.1.x",
      dependencies = { "nvim-lua/plenary.nvim", version = "x" },
   },

   {
      "nvim-telescope/telescope-ui-select.nvim",
      commit = "x",

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
