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
            -- diagnostics
            --
            DiagnosticUnderlineError = {
               undercurl = true,
               sp = "${red}", -- Red squiggly line
               fg = "NONE", -- No text color change
            },

            DiagnosticUnderlineWarn = {
               undercurl = true,
               sp = "${yellow}", -- Yellow squiggly line
               fg = "NONE",
            },

            DiagnosticUnderlineInfo = {
               undercurl = true,
               sp = "${blue}", -- Blue squiggly line
               fg = "NONE",
            },

            DiagnosticVirtualTextWarn = {
               bg = "${yellow}", -- Yellow background
               fg = "${black}", -- Text color (adjust if needed)
            },

            DiagnosticVirtualTextError = {
               bg = "${red}", -- Red background
               fg = "${black}",
            },

            DiagnosticVirtualTextInfo = {
               bg = "${blue}", -- Blue background
               fg = "${black}",
            },

            -- rust (treesitter)
            --
            -- ex: (), {}
            ["@punctuation.bracket.rust"] = {},
            ["@odp.punctuation_token_bracket.rust"] = {},
            -- ex: pub static ref SERVER_ADDRESS
            ["@constant.rust"] = { fg = "${red}" },
            -- ex: _
            ["@character.special.rust"] = { fg = "${red}" },

            -- rust (lsp)
            --
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

            -- html (treesitter)
            --
            htmlArg = { fg = "${orange}" },

            -- css (treesitter)
            --
            cssUnitDecorators = { fg = "${red}" },
            cssAtRuleLogical = { fg = "${cyan}" },
            cssBraces = { fg = "${orange}" },

            -- fish (treesitter)
            --
            fishForVariable = { fg = "${orange}" },
            fishOption = { fg = "${yellow}" },
            fishEscapedNl = { fg = "${purple}" },
            fishVariable = { fg = "${red}" },

            -- typescript (treesitter)
            --
            typescriptIdentifierName = { fg = "${red}" },
            typescriptBlock = { fg = "${yellow}" },
            special = { fg = "${purple}" },
            ["@namespace"] = { fg = "${yellow}" },
            ["@parameter"] = { fg = "${red}" },
            ["@constructor"] = { fg = "${purple}" },
            ["@constant.builtin"] = { fg = "${yellow}" },
            ["@constant"] = { fg = "${yellow}" },

            -- typescript (lsp)
            --
            ["@lsp.typemod.function.readonly.typescript"] = { fg = "${blue}" },
            ["@lsp.typemod.parameter.declaration.typescript"] = { fg = "${red}" },
         },
      })

      vim.cmd([[colorscheme onedark]])
   end,
}
