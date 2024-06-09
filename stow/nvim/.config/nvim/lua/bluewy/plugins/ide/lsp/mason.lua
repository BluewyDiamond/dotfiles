return {
   "williamboman/mason.nvim",

   dependencies = {
      "WhoIsSethDaniel/mason-tool-installer.nvim",
   },

   lazy = false,

   config = function()
      require("mason").setup()

      local mason_tool_installer = require("mason-tool-installer")

      mason_tool_installer.setup({
         ensure_installed = {
            "stylua",
         },

         run_on_start = true,
         auto_update = false,
         start_delay = 3000, -- 3 second delay
         debounce_hours = 5,
      })
   end,
}
