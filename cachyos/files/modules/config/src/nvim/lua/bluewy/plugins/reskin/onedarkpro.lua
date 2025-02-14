return {
   "olimorris/onedarkpro.nvim",

   priority = 1000,

   config = function()
      require("onedarkpro").setup({
         styles = {
            comments = "italic",
         },

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
            -- rust semantic tokens
            -- ex: unwrap()
            ["@function.builtin"] = {},

            -- ex: self
            ["@lsp.type.selfKeyword.rust"] = { fg = "${purple}" },

            -- ex: *, =, + ...
            ["@operator"] = {},

            -- ex: #[derive()]
            ["@lsp.type.decorator.rust"] = {},

            -- ex: StatusCode::Ok <--
            ["@lsp.type.const.rust"] = { fg = "${orange}" },

            -- ex: Self
            ["@lsp.type.selfTypeKeyword.rust"] = { fg = "${purple}" },

            -- rust treesitter
            -- ex: (), {}
            ["@punctuation.bracket.rust"] = {},
            ["@odp.punctuation_token_bracket.rust"] = {},

            -- ex: pub static ref SERVER_ADDRESS
            ["@constant.rust"] = { fg = "${red}" },

            -- ex: _
            ["@character.special.rust"] = { fg = "${red}" },

            -- TODO: Redo the following:

            -- html
            htmlArg = { fg = "${orange}" },

            -- css
            cssUnitDecorators = { fg = "${red}" },
            cssAtRuleLogical = { fg = "${cyan}" },
            cssBraces = { fg = "${orange}" },

            -- fish
            fishForVariable = { fg = "${orange}" },
            fishOption = { fg = "${yellow}" },
            fishEscapedNl = { fg = "${purple}" },
            fishVariable = { fg = "${red}" },

            -- typescript
            typescriptIdentifierName = { fg = "${red}" },
            typescriptBlock = { fg = "${yellow}" },
            ["@lsp.typemod.function.readonly.typescript"] = { fg = "${blue}" },
            ["@lsp.typemod.parameter.declaration.typescript"] = { fg = "${red}" },
            special = { fg = "${purple}" },
            ["@namespace"] = { fg = "${yellow}" },
            ["@parameter"] = { fg = "${red}" },
            ["@constructor"] = { fg = "${purple}" },
            ["@constant.builtin"] = { fg = "${yellow}" },
            ["@constant"] = { fg = "${yellow}" },
         },
      })

      vim.cmd([[colorscheme onedark]])
   end,
}
