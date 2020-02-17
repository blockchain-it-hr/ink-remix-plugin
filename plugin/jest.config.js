module.exports = {
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: [
        "ts", "tsx", "js", "jsx", "json"
    ],
    "moduleNameMapper": {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy"
    }
}