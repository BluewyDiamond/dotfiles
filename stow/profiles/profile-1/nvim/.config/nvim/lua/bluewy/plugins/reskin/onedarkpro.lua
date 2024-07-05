return {
   "olimorris/onedarkpro.nvim",
   version = "0.*",
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
            ["@function.builtin"] = {}, -- blank because yellow is definetly not right
            ["@namespace"] = { fg = "${yellow}" },
            ["@operator"] = { fg = "${purple}" },
            ["@parameter"] = { fg = "${red}" },

            Type = { fg = "${purple}" },

            -- rust specific
            ["@lsp.type.formatSpecifier.rust"] = { fg = "${purple}" },
            ["@lsp.type.function.rust"] = { fg = "${blue}" },
            ["@lsp.type.macro.rust"] = { fg = "${orange}" },
            ["@lsp.type.method.rust"] = { fg = "${blue}" },
            ["@lsp.type.static.rust"] = { fg = "${red}" },
            ["@lsp.type.struct.rust"] = { fg = "${yellow}" },
            ["@lsp.type.typeAlias.rust"] = { fg = "${yellow}" },
            ["@lsp.typemod.function.defaultLibrary.rust"] = { fg = "${cyan}" },
            ["@lsp.typemod.method.defaultLibrary.rust"] = { fg = "${blue}" },

            rustArrowCharacter = { fg = "${white}" },
            rustOperator = { fg = "${white}" },
            rustSelf = { fg = "${purple}" },
            rustSigil = { fg = "${white}" },
            rustStorage = { fg = "${purple}" },

            -- not working, maybe something else is conflicting with it?
            rustBoxPlacementBalance = { fg = "${purple}" },

            -- typescript
            typescriptIdentifierName = { fg = "${red}" },
         },
      })

      vim.cmd("colorscheme onedark")
   end,
}
