return {
   "folke/snacks.nvim",
   priority = 1000,
   lazy = false,

   config = function()
      local snacks = require("snacks")

      ---@type snacks.Config
      snacks.setup({
         bigfile = { enabled = true },
         dashboard = { enabled = false },
         indent = { enabled = true },
         input = { enabled = true },
         picker = { enabled = true },
         notifier = { enabled = true },
         quickfile = { enabled = true },
         scroll = { enabled = true },
         statuscolumn = { enabled = true },
         words = { enabled = true },
      })

      -- snacks.dashboard.setup()

      -- mappings
      --
      vim.keymap.set("n", "<leader>ff", function()
         snacks.picker.files({ layout = "ivy" })
      end, { noremap = true, silent = true, desc = "find files" })

      vim.keymap.set("n", "<leader>fw", function()
         snacks.picker.grep({ layout = "ivy" })
      end, { noremap = true, silent = true, desc = "find files" })

      vim.keymap.set("n", "<leader>fb", function()
         snacks.picker.buffers({ layout = "ivy" })
      end, { noremap = true, silent = true, desc = "find buffers" })

      vim.keymap.set("n", "<C-n>", function()
         snacks.picker.explorer({
            layout = { layout = { position = "right" } },
         })
      end, { noremap = true, silent = true, desc = "toggle explorer" })
   end,
}
