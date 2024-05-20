return {
   "olimorris/onedarkpro.nvim",
   priority = 1000,

   config = function()
      require("onedarkpro").setup({
         colors = {
            bg = "#1E2127",
            fg = "#5C6370",
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
            ["@lsp.type.struct.rust"] = { fg = "${yellow}" },
            ["@lsp.type.namespace.rust"] = { fg = "${yellow}" },
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

            -- not working, maybe something else is conflicting with it?
            rustFoldBraces = { fg = "${orange}" },
            rustBoxPlacementBalance = { fg = "${purple}" },
         },
      })

      vim.cmd("colorscheme onedark")
   end,
}
