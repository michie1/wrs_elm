#!/bin/bash
elm-package install
npm install --save webpack webpack-dev-server elm-webpack-loader elm-hot-loader
npm install --save-dev clean-webpack-plugin copy-webpack-plugin
