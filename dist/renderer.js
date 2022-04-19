/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/canvas.ts":
/*!***********************!*\
  !*** ./src/canvas.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nclass Canvas {\r\n    constructor() {\r\n        this.canvas = document.createElement('canvas');\r\n        this.canvas.id = \"canvas\";\r\n        this.canvas.width = window.innerWidth;\r\n        this.canvas.height = window.innerHeight;\r\n        this.canvas.style.zIndex = '8';\r\n        this.canvas.style.position = \"absolute\";\r\n        this.body = document.getElementsByTagName(\"body\")[0];\r\n        this.body.appendChild(this.canvas);\r\n        this.ctx = this.canvas.getContext(\"2d\");\r\n    }\r\n    setSize(w, h) {\r\n        this.canvas.width = w;\r\n        this.canvas.height = h;\r\n        return this.getAspectRatio();\r\n    }\r\n    getSize() {\r\n        return {\r\n            width: this.canvas.width,\r\n            height: this.canvas.height\r\n        };\r\n    }\r\n    getAspectRatio() {\r\n        return this.canvas.height / this.canvas.width;\r\n    }\r\n    RGBGrayScale(value) {\r\n        const col = value * 255;\r\n        return `rgba(${col}, ${col + 1}, ${col + 2}, 1)`;\r\n    }\r\n    fill(color) {\r\n        const ctx = this.getCtx();\r\n        ctx.fillStyle = color || 'rgba(0, 0, 0, 1)';\r\n        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);\r\n    }\r\n    getCtx() {\r\n        if (!this.ctx) {\r\n            throw new Error('no ctx initialized');\r\n        }\r\n        return this.ctx;\r\n    }\r\n}\r\nexports[\"default\"] = Canvas;\r\n\n\n//# sourceURL=webpack://electron-canvas-starter/./src/canvas.ts?");

/***/ }),

/***/ "./src/renderer.ts":
/*!*************************!*\
  !*** ./src/renderer.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __importDefault = (this && this.__importDefault) || function (mod) {\r\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst canvas_1 = __importDefault(__webpack_require__(/*! ./canvas */ \"./src/canvas.ts\"));\r\nclass Main {\r\n    constructor() {\r\n        this.dir = 0.01;\r\n        this.val = 0;\r\n        this.canvas = new canvas_1.default();\r\n        this.ctx = this.canvas.getCtx();\r\n    }\r\n    onUpdate() {\r\n        this.val += this.dir;\r\n        if (this.val <= 0 || this.val >= 1) {\r\n            this.dir = this.dir * -1;\r\n        }\r\n        this.canvas.fill();\r\n        this.ctx.beginPath();\r\n        this.ctx.arc(280, 190, 50, 0, 2 * Math.PI);\r\n        this.ctx.fillStyle = `rgba(204, 204, 0, ${this.val - 0.2})`;\r\n        this.ctx.fill();\r\n        this.ctx.font = \"30px Arial\";\r\n        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.val + 0.2 * 3})`;\r\n        this.ctx.fillText('Hello World', 200, 200);\r\n    }\r\n}\r\n(() => __awaiter(void 0, void 0, void 0, function* () {\r\n    const main = new Main();\r\n    const loop = () => {\r\n        window.requestAnimationFrame(gameLoop);\r\n    };\r\n    const gameLoop = () => {\r\n        main.onUpdate();\r\n        loop();\r\n    };\r\n    loop();\r\n}))();\r\n\n\n//# sourceURL=webpack://electron-canvas-starter/./src/renderer.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/renderer.ts");
/******/ 	
/******/ })()
;