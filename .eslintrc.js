module.exports = {
    "env": {
        "es6": true,
        "node": true,
		"browser": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab",
            {
                "SwitchCase": 1,
                "VariableDeclarator": 1
            }
        ],
        "linebreak-style": [
            "off",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": [
            "off"
        ],
        "prefer-const": [
            "error"
        ]
    }
};