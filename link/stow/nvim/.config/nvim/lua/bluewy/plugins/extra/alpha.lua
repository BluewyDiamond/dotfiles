return {
   "goolord/alpha-nvim", --> latest commit
   dependencies = {
      {
         "nvim-tree/nvim-web-devicons", --> latest commit
      },
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
