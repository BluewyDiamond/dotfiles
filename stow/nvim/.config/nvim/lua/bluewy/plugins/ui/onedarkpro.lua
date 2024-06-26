return {
   "olimorris/onedarkpro.nvim",
   priority = 1000,

   config = function()
      require("onedarkpro").setup({
         colors = {
            bg = "#23272E",
            fg = "#ABB2BF",
            cyan = "#56B497",
            cursorline = "#2C313C",
         },

         options = {
            cursorline = true,
         },

         styles = {
            types = "NONE",
            methods = "NONE",
            numbers = "NONE",
            strings = "NONE",
            comments = "italic",
            keywords = "bold,italic",
            constants = "NONE",
            functions = "italic",
            operators = "NONE",
            variables = "NONE",
            parameters = "NONE",
            conditionals = "italic",
            virtual_text = "NONE",
         },

         highlights = {
            -- general
            ["@parameter"] = { fg = "${red}" },
            ["@namespace"] = { fg = "${yellow}" },
            ["Type"] = { fg = "${purple}" },
            ["@function.builtin"] = {}, -- blank because yellow is definetly not right
            ["@operator"] = { fg = "${purple}" },

            -- rust specific
            ["@lsp.type.static.rust"] = { fg = "${red}" },
            ["@lsp.type.typeAlias.rust"] = { fg = "${yellow}" },
            ["@lsp.type.struct.rust"] = { fg = "${yellow}" },
            ["@lsp.type.method.rust"] = { fg = "${blue}" },
            ["@lsp.type.function.rust"] = { fg = "${blue}" },
            ["@lsp.typemod.method.defaultLibrary.rust"] = { fg = "${blue}" },
            ["@lsp.typemod.function.defaultLibrary.rust"] = { fg = "${cyan}" },
            ["@lsp.type.macro.rust"] = { fg = "${orange}" },
            ["@lsp.type.formatSpecifier.rust"] = { fg = "${purple}" },

            rustOperator = { fg = "${white}" },
            rustArrowCharacter = { fg = "${white}" },
            rustStorage = { fg = "${purple}" },
            rustSelf = { fg = "${purple}" },
            rustSigil = { fg = "${white}" },

            -- not working, maybe something else is conflicting with it?
            rustFoldBraces = { fg = "${orange}" },
            rustBoxPlacementBalance = { fg = "${purple}" },

            -- c specific
            -- not working idk why
            cBlock = { fg = "${blue}" },
            cParen = { fg = "${blue}" },
         },
      })

      vim.cmd("colorscheme onedark")
   end,
}
