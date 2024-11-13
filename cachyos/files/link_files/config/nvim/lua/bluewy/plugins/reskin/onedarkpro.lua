return {
   "olimorris/onedarkpro.nvim",
   --> latest commit
   priority = 1000,

   config = function()
      require("onedarkpro").setup({
         colors = {
            bg = "#282C34",
            fg = "#ABB2BF",
            cyan = "#56b6c2",
            cursorline = "#2C313C",
         },

         options = {
            cursorline = true,
         },

         highlights = {
            -- general due to rust
            -- hmmmm, TODO: figure out why i put this in
            -- ["@function.builtin"] = {}, -- blank because yellow is definetly not right

            -- rust specific
            ["@lsp.type.parameter.rust"] = { fg = "${red}" },
            ["@lsp.type.namespace.rust"] = { fg = "${yellow}" },
            ["@lsp.type.formatSpecifier.rust"] = { fg = "${purple}" },
            ["@lsp.type.function.rust"] = { fg = "${blue}" },
            ["@lsp.type.macro.rust"] = { fg = "${orange}" },
            ["@lsp.type.method.rust"] = { fg = "${blue}" },
            ["@lsp.type.static.rust"] = { fg = "${red}" },
            ["@lsp.type.struct.rust"] = { fg = "${yellow}" },
            ["@lsp.type.typeAlias.rust"] = { fg = "${yellow}" },
            ["@lsp.typemod.function.defaultLibrary.rust"] = { fg = "${cyan}" },
            ["@lsp.typemod.method.defaultLibrary.rust"] = { fg = "${blue}" },
            ["@lsp.type.const.rust"] = { fg = "${orange}" },

            -- for example: ->
            rustArrowCharacter = { fg = "${white}" },
            -- for example: =>, +, !=, &&
            rustOperator = { fg = "${white}" },
            -- for example: self
            rustSelf = { fg = "${purple}" },
            -- for example: &, *, @, !, ?
            rustSigil = { fg = "${white}" },
            -- for example: static, const
            rustStorage = { fg = "${purple}" },

            -- not working, maybe something else is conflicting with it?
            rustBoxPlacementBalance = { fg = "${purple}" },

            -- html
            htmlArg = { fg = "${orange}" },
         },
      })

      vim.cmd([[colorscheme onedark]])
   end,
}
