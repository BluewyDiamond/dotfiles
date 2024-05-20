return {
   {
      "nvim-telescope/telescope.nvim",
      dependencies = { "nvim-lua/plenary.nvim" },

      config = function()
         vim.keymap.set("n", "<leader>ff", "<cmd>Telescope find_files<CR>", { noremap = true, silent = true })
         vim.keymap.set(
            "n",
            "<leader>fa",
            "<cmd>Telescope find_files follow=true no_ignore=true hidden=true<CR>",
            { noremap = true, silent = true }
         )
         vim.keymap.set("n", "<leader>fw", "<cmd>Telescope live_grep<CR>", { noremap = true, silent = true })
         vim.keymap.set("n", "<leader>fb", "<cmd>Telescope buffers<CR>", { noremap = true, silent = true })
         vim.keymap.set(
            "n",
            "<leader>fz",
            "<cmd>Telescope current_buffer_fuzzy_find<CR>",
            { noremap = true, silent = true }
         )

         vim.keymap.set("n", "<leader>cm", "<cmd>Telescope git_commits<CR>", { noremap = true, silent = true })
         vim.keymap.set("n", "<leader>gt", "<cmd>Telescope git_status<CR>", { noremap = true, silent = true })
      end,
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
