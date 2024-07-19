return {
   {
      "nvim-telescope/telescope.nvim",
      version = "0.1.x",
      dependencies = {
         { "nvim-lua/plenary.nvim" }, --> latest commit
      },
   },

   {
      "nvim-telescope/telescope-ui-select.nvim", --> latest commit

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
