require("bluewy.config")

-- Map <C-S-.> to cycle to the next buffer
vim.api.nvim_set_keymap('n', '<C-S-.>', '<cmd>BufferLineCycleNext<CR>', { noremap = true, silent = true, desc = "next buffer" })

-- Map <C-S-h> to cycle to the previous buffer
vim.api.nvim_set_keymap('n', '<C-S-h>', '<cmd>BufferLineCyclePrev<CR>', { noremap = true, silent = true, desc = "previous buffer" })

-- Map <C-S-A-.> to move buffer to the right
vim.api.nvim_set_keymap('n', '<C-S-A-.>', '<cmd>BufferLineMoveNext<CR>', { noremap = true, silent = true, desc = "move buffer to the right" })

-- Map <C-S-A-h> to move buffer to the left
vim.api.nvim_set_keymap('n', '<C-S-A-h>', '<cmd>BufferLineMovePrev<CR>', { noremap = true, silent = true, desc = "move buffer to the left" })
