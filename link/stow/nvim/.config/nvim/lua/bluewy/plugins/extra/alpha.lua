return {
   "goolord/alpha-nvim", --> latest commit
   dependencies = {
      { "nvim-tree/nvim-web-devicons", version = "0.x" },
   },

   config = function()
      local alpha = require("alpha")
      local dashboard = require("alpha.themes.startify")

      dashboard.section.header.val = {
         [[                                                                       ]],
         [[                                                                       ]],
         [[                                                                       ]],
         [[                                                                       ]],
         [[                                                                     ]],
         [[       ████ ██████           █████      ██                     ]],
         [[      ███████████             █████                             ]],
         [[      █████████ ███████████████████ ███   ███████████   ]],
         [[     █████████  ███    █████████████ █████ ██████████████   ]],
         [[    █████████ ██████████ █████████ █████ █████ ████ █████   ]],
         [[  ███████████ ███    ███ █████████ █████ █████ ████ █████  ]],
         [[ ██████  █████████████████████ ████ █████ █████ ████ ██████ ]],
         [[                                                                       ]],
         [[                                                                       ]],
         [[                                                                       ]],
      }

      alpha.setup(dashboard.opts)
   end,
}
